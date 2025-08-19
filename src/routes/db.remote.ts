import * as v from 'valibot';
import { query, command } from '$app/server';
import { db } from '$lib/db';

import {
    /* Drizzle tables */
    profiles, services, scrapers, notifications,
    /* Valibot schemas */
    ProfileInsertSchema, ProfileUpdateSchema,
    ServiceInsertSchema, ScraperInsertSchema,
    NotificationInsertSchema,
    /* TS helper types */
    type ProfileInsert, type ProfileUpdate,
    type ServiceInsert, type ScraperInsert, type NotificationInsert
} from '../../drizzle/schema';

import { eq, gt, and, inArray, desc, sql } from 'drizzle-orm';
import { getUserId } from '$lib/Managers/AuthManager';

// Generate a 32-char lowercase hex ID (similar to lower(hex(randomblob(16))))
const generateHexId = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
};


/*──────────────────────── SCRAPERS ──────────────────────*/
/** Get the latest `last_update` for a scraper row
 *  whose JSON param key matches the supplied value. */
export const scraper_GetLastUpdateByArea = query(v.object({ key: v.string(), value: v.any() }), async ({ key, value }): Promise<number> =>
    await db()
        .select({ last_update: scrapers.last_update })
        .from(scrapers)
        .where(sql`params->>'${sql.raw(key)}' = ${value}`)
        .orderBy(desc(scrapers.last_update))
        .limit(1)
        .then(r => r[0]?.last_update ?? -1)
);

export const scraper_GetAll = query(async () =>
    await db()
        .select()
        .from(scrapers)
);

export const scraper_GetLastUpdateByCompanyName = query(v.string(), async (companyName: string): Promise<number> =>
    await db()
        .select({ last_update: scrapers.last_update })
        .from(scrapers)
        .where(eq(scrapers.company, companyName))
        .orderBy(desc(scrapers.last_update))
        .limit(1)
        .then(r => r[0].last_update || -1)
);

export const scraper_ExistsByArea = query(v.object({ key: v.string(), value: v.any() }), async ({ key, value }) =>
    await db()
        .select()
        .from(scrapers)
        .where(sql`params->>'${sql.raw(key)}' = ${value}`)
        .limit(1)
        .then(r => r.length > 0)
);

export const scraper_Create = command(ScraperInsertSchema, async (payload: ScraperInsert) => {
    const now = Date.now();
    const r = await db()
        .insert(scrapers)
        .values({
            ...payload,
            id: (payload as any).id ?? generateHexId(),
            frequency: payload.frequency ?? 5,
            services: (payload as any).services ?? [],
            params: (payload as any).params ?? {},
            last_ping: now,
            last_update: now
        });
    return r.success;
});

export const scraper_UpdateLastPingByOptionsKeyValue = command(v.object({ key: v.string(), value: v.any(), unixTimestamp: v.number() }), async ({ key, value, unixTimestamp }) =>
    await db()
        .update(scrapers)
        .set({ last_ping: unixTimestamp })
        .where(sql`params->>'${sql.raw(key)}' = ${value}`)
        .then(r => r.success)
);

export const scraper_UpdateLastUpdateByOptionsKeyValue = command(v.object({ key: v.string(), value: v.any(), unixTimestamp: v.number() }), async ({ key, value, unixTimestamp }) =>
    await db()
        .update(scrapers)
        .set({ last_update: unixTimestamp })
        .where(sql`params->>'${sql.raw(key)}' = ${value}`)
        .then(r => r.success)
);


/*──────────────────────── PROFILES ─────────────────────*/
export const profile_GetRawUserData = query(v.string(), async (id: string) =>
    await db()
        .select({ raw_user_meta_data: profiles.raw_user_meta_data })
        .from(profiles)
        .where(eq(profiles.id, id))
        .limit(1)
        .then(r => r[0]?.raw_user_meta_data ?? {})
);

export const profile_GetCreditsByUserId = query(v.string(), async (userId: string) => {
    // Gracefully handle missing/invalid userId and missing profile rows
    if (!userId) return 0;

    const result = await db()
        .select({ credits: profiles.credits })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);

    const credits = result[0]?.credits;
    return typeof credits === 'number' && credits >= 0 ? credits : 0;
});

export const profile_GetUserEmailByUserId = query(v.string(), async (userId: string) =>
    await db()
        .select({ email: profiles.email })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1)
        .then(r => r[0]?.email ?? '')
);

export const profile_GetUserByUserId = query(v.string(), async (id) =>
    await db()
        .select()
        .from(profiles)
        .where(eq(profiles.id, id)).limit(1)
        .then((r: unknown[]) => r[0] ?? null)
);

export const profile_GetUsersWithCredits = query(async () =>
    await db()
        .select()
        .from(profiles)
        .where(gt(profiles.credits, 0))
);

export const profile_GetUsersWithCreditsByIds = query(v.array(v.string()), async (ids: string[]) =>
    await db()
        .select()
        .from(profiles)
        .where(and(gt(profiles.credits, 0), inArray(profiles.id, ids)))
);

export const profile_GetAll = query(async () =>
    await db()
        .select()
        .from(profiles)
);

export const profile_Create = command(ProfileInsertSchema, async (payload: ProfileInsert) =>
    await db()
        .insert(profiles)
        .values({
            ...payload,
            id: (payload as any).id ?? generateHexId(),
            credits: payload.credits ?? 3
        })
);

export const profile_UpdateUserByUserId = command(v.object({ userId: v.string(), data: ProfileUpdateSchema }), async ({ userId, data }: { userId: string; data: ProfileUpdate }) =>
    await db()
        .update(profiles)
        .set(data)
        .where(eq(profiles.id, userId))
        .then(r => r.success)
);

export const profile_RemoveUserByUserId = command(v.string(), async (userId: string) =>
    await db()
        .delete(profiles)
        .where(eq(profiles.id, userId))
);

export const profile_DecreaseOneCreditByUserId = command(v.string(), async (userId: string) =>
    await db()
        .update(profiles)
        .set({ credits: sql`${profiles.credits} - 1` })
        .where(eq(profiles.id, userId)).then(r => r.success)
);

export const profile_ProlongSubscriptionByUserEmail = command(v.object({ email: v.string(), days: v.number() }), async ({ email, days }) => {
    const future = Math.floor((Date.now() + days * 86_400_000) / 1000);
    return await db()
        .update(profiles)
        .set({ subscription_expiration_date: future.toString(), credits: 500 })
        .where(eq(profiles.email, email))
        .then(r => r.success);
});

export const profile_RefillCreditsByUserEmail = command(v.object({ email: v.string(), amount: v.number() }), async ({ email, amount }) => {
    const [user] = await db()
        .select()
        .from(profiles)
        .where(eq(profiles.email, email))
        .limit(1);

    if (!user) return false;

    const newCredits = (user.credits ?? 0) + amount;
    return await db()
        .update(profiles)
        .set({ credits: newCredits })
        .where(eq(profiles.email, email))
        .then(r => r.success);
});


/*────────────────────── NOTIFICATIONS ───────────────────*/
export const notification_Create = command(NotificationInsertSchema, async (payload: NotificationInsert) =>
    await db()
        .insert(notifications)
        .values({
            ...payload,
            id: (payload as any).id ?? generateHexId(),
            date: (payload as any).date ?? Math.floor(Date.now() / 1000)
        })
        .then(r => r.success)
);

export const notification_GetByArea = query(v.string(), async (area: string) =>
    await db()
        .select()
        .from(notifications)
        .where(eq(notifications.area, area))
);

export const notification_GetAll = query(async () =>
    await db()
        .select()
        .from(notifications)
);

export const notification_GetLatest = query(v.optional(v.number(), 3), async (count: number = 3) =>
    await db()
        .select()
        .from(notifications)
        .orderBy(desc(notifications.date))
        .limit(count)
);

/*──────────────────────── SERVICES ──────────────────────*/
export const service_GetConfigByCompanyName = query(v.object({ companyName: v.string(), userId: v.optional(v.string()) }), async ({ companyName, userId }) => {
    const effectiveUserId = userId && userId.length > 0 ? userId : await getUserId();
    return await db()
        .select()
        .from(services)
        .where(and(eq(services.user, effectiveUserId), eq(services.name, companyName)))
        .limit(1)
        .then(r => r[0] ?? null);
});

export const service_GetUserIdsByOptions = query(v.object({ key: v.string(), value: v.any() }), async ({ key, value }) =>
    await db()
        .select()
        .from(services)
        .where(sql`options->>'${sql.raw(key)}' = ${value}`)
);

export const service_CreateOrUpdate = command(ServiceInsertSchema, async (payload: ServiceInsert) => {
    const { user, name, notificationWithinTime, ...rest } = payload;
    const [existing] = await db()
        .select()
        .from(services)
        .where(and(eq(services.user, user), eq(services.name, name)))
        .limit(1);

    const values = {
        ...rest,
        options: (rest as any).options ?? {},
        notificationWithinTime: String(notificationWithinTime)
    };

    const res = existing
        ? await db()
            .update(services)
            .set(values)
            .where(eq(services.id, existing.id))
        : await db()
            .insert(services)
            .values({ id: generateHexId(), user, name, ...values });

    return res.success;
});

export const service_RemoveByUserIdAndServiceName = command(v.object({ userId: v.string(), serviceName: v.string() }), async ({ userId, serviceName }) => {
    const res = await db()
        .delete(services)
        .where(and(eq(services.user, userId), eq(services.name, serviceName)));
    return res.success;
});