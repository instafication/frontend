import type { RequestHandler } from './$types';
import {
    scraper_ExistsByArea,
    scraper_UpdateLastUpdateByOptionsKeyValue,
    scraper_GetLastUpdateByArea,
    notification_Create,
    service_GetUserIdsByOptions,
    profile_GetUsersWithCreditsByIds
} from '../../../db.remote';
import { sendLaundryNotification } from '$lib/Managers/EmailManager';
import type { Scraper } from '../../../../drizzle/types';
import type { JsonValue } from 'type-fest';
import { db } from '$lib/db';
import { scrapers } from '../../../../../drizzle/schema';
import { sql } from 'drizzle-orm';

export interface postTemplate {
    company: string;
    services: string[];
    params: postParamsSssb;
}
export interface postParamsSssb {
    date: string;
    time: string;
    area: string;
}

// Generate a 32-char lowercase hex ID (similar to lower(hex(randomblob(16))))
const generateHexId = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
};

async function HandleSssb(scraper: Scraper): Promise<Response> {
    const params = scraper.params as JsonValue;
    const area =
        params && typeof params === 'object' && 'area' in params ? (params as { area: string }).area : '';
    const paramDate =
        params && typeof params === 'object' && 'date' in params ? (params as { date: string }).date : '';
    const paramTime =
        params && typeof params === 'object' && 'time' in params ? (params as { time: string }).time : '';

    console.log(`[Scraper] New data from ${area}: ${`${paramDate} ${paramTime}`}.`);

    /* ────────────── Parse date & time (always CET/CEST) ────────────── */
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 2); // convert to CET/CEST
    const currentYear = now.getFullYear();
    const [, , date, monthName, startTime] =
        `${paramDate} ${paramTime}`.match(/([A-ZÅÄÖ]{3})\s(\d+)\s([A-Z]{3})\s(\d\d:\d\d)/) ?? [];

    const monthIdx = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(
        monthName
    );
    const fullDateString = `${currentYear}-${(monthIdx + 1).toString().padStart(2, '0')}-${date?.toString().padStart(2, '0')}T${startTime}:00`;
    const dateObj = new Date(fullDateString);
    dateObj.setUTCHours(dateObj.getUTCHours() + 2); // force CET/CEST again

    /* ────────────── Business checks ────────────── */
    const storedLastUpdated = await scraper_GetLastUpdateByArea({ key: 'area', value: area });
    if (storedLastUpdated === dateObj.getTime()) {
        console.log('[Scraper] Duplicate data – skipping.');
        return new Response('Duplicate data', { status: 200 });
    }

    const withinThreeDays = Math.abs(dateObj.getTime() - now.getTime()) < 3 * 24 * 60 * 60 * 1000;
    if (!withinThreeDays) {
        console.log('[Scraper] New slot is >3 days away – skipping notifications.');
        return new Response('Slot is too far in the future', { status: 200 });
    }

    /* ────────────── Persist new timestamp ────────────── */
    await scraper_UpdateLastUpdateByOptionsKeyValue({ key: 'area', value: area, unixTimestamp: dateObj.getTime() });

    /* ────────────── Create notification row ────────────── */
    await notification_Create({
        title: `Ny tid och datum i ${area}`,
        body: `Ny tid och datum i ${area}: ${paramDate} ${paramTime}.`,
        area,
        date: dateObj.getTime()
    });

    /* ────────────── Notify users ────────────── */
    try {
        const services = await service_GetUserIdsByOptions({ key: 'area', value: area });
        if (!services.length) {
            console.log(`[Scraper] No users configured for area: ${area}`);
            return new Response('No interested users', { status: 200 });
        }

        const userIds = services.map((s: { user: string }) => s.user);
        const profiles = await profile_GetUsersWithCreditsByIds(userIds);

        for (const profile of profiles) {
            const serviceCfg = services.find((s: { user: string }) => s.user === profile.id);
            if (!serviceCfg) continue;

            const diffSec = Math.abs(dateObj.getTime() - now.getTime()) / 1000;
            if (diffSec > Number(serviceCfg.notificationWithinTime)) continue;

            if (serviceCfg.notificationMethod === 'e-post') {
                console.log(`[Scraper] Sending email to ${profile.email} for ${area}`);
                await sendLaundryNotification(profile.email ?? "", area, paramDate, paramTime);
            } else if (serviceCfg.notificationMethod === 'SMS') {
                console.log(`[Scraper] SMS queued for ${profile.id}`);
            }
        }
    } catch (err) {
        console.error(`[Scraper] Error while sending notifications: ${err}`);
    }

    return new Response('Notifications processed', { status: 200 });
}

/* ─────────────────────── POST handler ─────────────────────── */
export const POST = (async ({ request }) => {
    try {
        const scraper: Scraper = await request.json();
        console.log('[Scraper] Incoming payload:', JSON.stringify(scraper, null, 2));

        if (scraper.company !== 'Stockholms Studentbostäder') {
            return new Response('Unknown service', { status: 400 });
        }

        const params: postParamsSssb = scraper.params as postParamsSssb;
        if (!params?.area || !params?.date || !params?.time) {
            return new Response('Missing required params', { status: 400 });
        }

        /* Ensure scraper row exists */
        const exists = await scraper_ExistsByArea({ key: 'area', value: params.area });
        if (!exists) {
            // await scraper_Create(scraper);
            const now = Date.now();
            const r = await db()
                .insert(scrapers)
                .values({
                    ...scraper,
                    id: (scraper as any).id ?? generateHexId(),
                    frequency: scraper.frequency ?? 5,
                    services: (scraper as any).services ?? [],
                    params: (scraper as any).params ?? {},
                    last_ping: now,
                    last_update: now
                });
            console.log(`[Scraper] New scraper row created for area ${params.area}`);
            return new Response('New scraper row created', { status: 200 });
        }

        /* Always bump last_ping */
        // await scraper_UpdateLastPingByOptionsKeyValue(
        //     { key: 'area', value: params.area, unixTimestamp: Date.now() }
        // );

        const r2 = await db()
            .update(scrapers)
            .set({ last_ping: Date.now() })
            .where(sql`params->>'${sql.raw('area')}' = ${params.area}`)
            .then(r => r.success);
        console.log(`[Scraper] Last ping updated for area ${params.area}: ${r2}`);

        return await HandleSssb(scraper);
    } catch (error) {
        console.error(`[Scraper] Unhandled error: ${error}`);
        return new Response(`Internal error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 })
    }
}) satisfies RequestHandler;
