// src/routes/api/callback/scraper/+server.ts
import type { RequestHandler } from './$types';
import { sql, and, gt, inArray, desc, eq } from 'drizzle-orm';
import { db } from '$lib/db';

// ⬇️ Import your Drizzle tables here
import {
    scrapers,
    services as servicesTable,
    profiles as profilesTable,
    notifications as notificationsTable,
} from '../../../../../drizzle/schema';

// If this mailer works in CF Workers, you can keep it.
// If not, you can stub it or guard it with try/catch as below.
import { sendLaundryNotification } from '$lib/Managers/EmailManager';

/* --------------------------- Payload interfaces --------------------------- */

export interface postTemplate {
    company: string;
    services: string[];
    params: postParamsSssb;
}
export interface postParamsSssb {
    date: string;            // e.g. "MON 8 SEP"
    time: string;            // e.g. "13:00-16:10"
    area: string;            // e.g. "kungshamra"
}

/* ------------------------------ Utilities -------------------------------- */

// Generate a 32-char lowercase hex ID (similar to lower(hex(randomblob(16))))
const generateHexId = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
};

// Parse "MON 8 SEP" + "13:00-16:10" -> booking start timestamp (ms)
// NOTE: simple "+2h to force CET/CEST" like your original. Consider a real TZ lib later.
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;
function parseCETDateTime(paramDate: string, paramTime: string): number {
    const m = `${paramDate} ${paramTime}`.match(/([A-ZÅÄÖ]{3})\s(\d{1,2})\s([A-Z]{3})\s(\d\d:\d\d)/);
    if (!m) throw new Error(`Unparseable date/time: "${paramDate}" "${paramTime}"`);
    const date = Number(m[2]);
    const month = m[3] as typeof MONTHS[number];
    const start = m[4];
    const idx = MONTHS.indexOf(month);
    if (idx < 0) throw new Error(`Unknown month: ${month}`);
    const year = new Date().getFullYear();
    const iso = `${year}-${String(idx + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}T${start}:00`;
    const dt = new Date(iso);
    dt.setUTCHours(dt.getUTCHours() + 2); // simplistic CET/CEST push
    return dt.getTime();
}

/* ------------------------- Inlined "remote" funcs ------------------------- */
/* All these talk to Drizzle/D1 directly; no $app/server query/command wrappers. */

// --- SCRAPERS ---
async function scraper_ExistsByArea(area: string): Promise<boolean> {
    return await db()
        .select({ id: scrapers.id }) // select only primitive column to avoid JSON parsing
        .from(scrapers)
        .where(sql`json_extract(${scrapers.params}, '$.area') = ${area}`)
        .limit(1)
        .then(r => r.length > 0);
}

async function scraper_GetLastUpdateByArea(area: string): Promise<number> {
    return await db()
        .select({ last_update: scrapers.last_update }) // avoid JSON col reads
        .from(scrapers)
        .where(sql`json_extract(${scrapers.params}, '$.area') = ${area}`)
        .orderBy(desc(scrapers.last_update))
        .limit(1)
        .then(r => (r[0]?.last_update ?? -1) as number);
}

async function scraper_UpdateLastUpdateByArea(area: string, unixTimestamp: number): Promise<boolean> {
    return await db()
        .update(scrapers)
        .set({ last_update: unixTimestamp })
        .where(sql`json_extract(${scrapers.params}, '$.area') = ${area}`)
        .then(r => (r as any).success ?? true);
}

async function scraper_UpdateLastPingByArea(area: string, unixTimestamp: number): Promise<boolean> {
    return await db()
        .update(scrapers)
        .set({ last_ping: unixTimestamp })
        .where(sql`json_extract(${scrapers.params}, '$.area') = ${area}`)
        .then(r => (r as any).success ?? true);
}

// --- NOTIFICATIONS ---
type NotificationInsert = {
    id?: string;
    title: string;
    body: string;
    area: string;
    date?: number; // seconds since epoch in your schema; adjust if ms
};
async function notification_Create(payload: NotificationInsert): Promise<boolean> {
    const toInsert = {
        ...payload,
        id: payload.id ?? generateHexId(),
        // If your schema stores seconds (as your remote code implies), keep /1000.
        // If it's ms in your schema, remove Math.floor and *1000 conversions.
        date: payload.date ?? Math.floor(Date.now() / 1000),
    };
    return await db().insert(notificationsTable).values(toInsert).then(r => (r as any).success ?? true);
}

// --- SERVICES ---
async function service_GetUserIdsByOptionsArea(area: string): Promise<
    Array<{ user: string; notificationWithinTime: string; notificationMethod: string }>
> {
    // Keep the shape your code expects: user, notificationWithinTime, notificationMethod
    return await db()
        .select({
            user: servicesTable.user,
            notificationWithinTime: servicesTable.notificationWithinTime,
            notificationMethod: servicesTable.notificationMethod,
        })
        .from(servicesTable)
        .where(sql`json_extract(${servicesTable.options}, '$.area') = ${area}`);
}

// --- PROFILES ---
async function profile_GetUsersWithCreditsByIds(ids: string[]) {
    if (!ids?.length) return [];
    return await db()
        .select({
            id: profilesTable.id,
            email: profilesTable.email,
            credits: profilesTable.credits,
        })
        .from(profilesTable)
        .where(and(gt(profilesTable.credits, 0), inArray(profilesTable.id, ids)));
}

/* ------------------------ Business handler (local) ------------------------ */

async function HandleSssb(scraperPayload: postTemplate): Promise<Response> {
    const { params } = scraperPayload;
    const area = params.area ?? '';
    const paramDate = params.date ?? '';
    const paramTime = params.time ?? '';

    console.log(`[Scraper] New data from ${area}: ${paramDate} ${paramTime}.`);

    // Parse date & time (CET/CEST simplified)
    const bookingTs = parseCETDateTime(paramDate, paramTime);
    const nowMs = Date.now();

    // Duplicate/age checks
    const storedLastUpdated = await scraper_GetLastUpdateByArea(area);
    if (storedLastUpdated === bookingTs) {
        console.log('[Scraper] Duplicate data – skipping.');
        return new Response('Duplicate data', { status: 200 });
    }

    const withinThreeDays = Math.abs(bookingTs - nowMs) < 3 * 24 * 60 * 60 * 1000;
    if (!withinThreeDays) {
        console.log('[Scraper] New slot is >3 days away – skipping notifications.');
        // Still persist so future duplicates are ignored
        await scraper_UpdateLastUpdateByArea(area, bookingTs);
        return new Response('Slot is too far in the future', { status: 200 });
    }

    // Persist new timestamp
    await scraper_UpdateLastUpdateByArea(area, bookingTs);

    // Create notification row
    await notification_Create({
        title: `Ny tid och datum i ${area}`,
        body: `Ny tid och datum i ${area}: ${paramDate} ${paramTime}.`,
        area,
        // If your notifications.date expects seconds, pass Math.floor(bookingTs/1000)
        date: Math.floor(bookingTs / 1000),
    });

    // Notify users
    try {
        const services = await service_GetUserIdsByOptionsArea(area);
        if (!services.length) {
            console.log(`[Scraper] No users configured for area: ${area}`);
            return new Response('No interested users', { status: 200 });
        }

        const userIds = services.map(s => s.user);
        const profiles = await profile_GetUsersWithCreditsByIds(userIds);

        for (const profile of profiles) {
            const serviceCfg = services.find(s => s.user === profile.id);
            if (!serviceCfg) continue;

            const diffSec = Math.abs(bookingTs - nowMs) / 1000;
            if (diffSec > Number(serviceCfg.notificationWithinTime)) continue;

            if (serviceCfg.notificationMethod === 'e-post') {
                console.log(`[Scraper] Sending email to: ${profile.email} for area: ${area}, date: ${paramDate}, time: ${paramTime}`);
                try {
                    await sendLaundryNotification(profile.email ?? '', area, paramDate, paramTime);
                    console.log(`[Scraper] Email sent to: ${profile.email} for area: ${area}, date: ${paramDate}, time: ${paramTime}`);
                } catch (e) {
                    console.warn('[Scraper] sendLaundryNotification failed (continuing):', e);
                }
            } else if (serviceCfg.notificationMethod === 'SMS') {
                console.log(`[Scraper] SMS queued for: ${profile.id}, area: ${area}, date: ${paramDate}, time: ${paramTime}`);
            }
        }
    } catch (err) {
        console.error(`[Scraper] Error while sending notifications: ${err}`);
    }

    return new Response('Notifications processed', { status: 200 });
}

/* ----------------------------- POST handler ------------------------------ */

export const POST: RequestHandler = (async ({ request }) => {
    try {
        // Parse payload (request.json() is fine; your payload is valid)
        const scraper = (await request.json()) as postTemplate;
        console.log('[Scraper] Incoming payload:', JSON.stringify(scraper, null, 2));

        if (scraper.company !== 'Stockholms Studentbostäder') {
            return new Response('Unknown service', { status: 400 });
        }

        const params = scraper.params;
        if (!params?.area || !params?.date || !params?.time) {
            return new Response('Missing required params', { status: 400 });
        }

        /* Ensure scraper row exists (D1/SQLite json_extract) */
        const exists = await scraper_ExistsByArea(params.area);
        if (!exists) {
            const now = Date.now();
            await db()
                .insert(scrapers)
                .values({
                    // If your `id` is autoincrement int, remove the id field here.
                    id: generateHexId() as any,
                    company: scraper.company as any,
                    frequency: (scraper as any).frequency ?? 5,
                    services: (scraper as any).services ?? [],
                    params: (scraper as any).params ?? {},
                    last_ping: now,
                    last_update: now,
                });
            console.log(`[Scraper] New scraper row created for area ${params.area}`);
            // (No early return; continue to normal handling)
        }

        /* Always bump last_ping */
        await scraper_UpdateLastPingByArea(params.area, Date.now());
        console.log(`[Scraper] Last ping updated for area ${params.area}`);

        /* Main business logic */
        return await HandleSssb(scraper);
    } catch (error) {
        console.error(`[Scraper] Unhandled error: ${error}`);
        return new Response(
            `Internal error: ${error instanceof Error ? error.message : String(error)}`,
            { status: 500 }
        );
    }
}) satisfies RequestHandler;
