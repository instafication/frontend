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
    type ServiceInsert, type ScraperInsert, type NotificationInsert,
    type Profile,
    type Scraper
} from '../../drizzle/schema';

import { eq, gt, and, inArray, desc, sql } from 'drizzle-orm';

/* ───────── helper types for object params ───────── */

type KV = { key: string; value: unknown };
type WithUnix = KV & { unixTimestamp: number };
type UserName = { user: string; name: string };
type EmailDays = { email: string; days: number };
type EmailAmount = { email: string; amount: number };

/*──────────────────────── SCRAPERS ──────────────────────*/
// list all
export const scraper_getAll = query(() => db().select().from(scrapers));

// last-update helpers
export const scraper_getLastUpdated = query(
    v.object({ key: v.string(), value: v.any() }),
    ({ key, value }: KV) =>
        db()
            .select({ last_update: scrapers.last_update })
            .from(scrapers)
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .limit(1)
            .then(r => Number(r[0]?.last_update) || -1)
);

export const scraper_getLastUpdateByCompanyName = query(v.string(), async(companyName: string) =>
    db()
        .select({ last_update: scrapers.last_update })
        .from(scrapers)
        .where(eq(scrapers.company, companyName))
        .orderBy(desc(scrapers.last_update))
        .limit(1)
        .then(r => Number(r[0]?.last_update) || -1)
);

export const scraper_exists = query(
    v.object({ key: v.string(), value: v.any() }),
    ({ key, value }: KV) =>
        db()
            .select()
            .from(scrapers)
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .limit(1)
            .then(r => r.length > 0)
);

// insert
export const scraper_create = command(
    ScraperInsertSchema,
    async (payload: ScraperInsert) => {
        const now = BigInt(Date.now());
        const res = await db().insert(scrapers).values({
            ...payload,
            last_ping: now,
            last_update: now
        });
        return res.count > 0;
    }
);

// ping & last-updated
export const scraper_updatePing = command(
    v.object({ key: v.string(), value: v.any(), unixTimestamp: v.number() }),
    ({ key, value, unixTimestamp }: WithUnix) =>
        db()
            .update(scrapers)
            .set({ last_ping: BigInt(unixTimestamp) })
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .then(r => r.count > 0)
);

export const scraper_updateLastUpdated = command(
    v.object({ key: v.string(), value: v.any(), unixTimestamp: v.number() }),
    ({ key, value, unixTimestamp }: WithUnix) =>
        db()
            .update(scrapers)
            .set({ last_update: BigInt(unixTimestamp) })
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .then(r => r.count > 0)
);

/*──────────────────────── PROFILES ─────────────────────*/

// reads
export const profile_getRawUserData = query(
    v.string(),
    (id: string) =>
        db()
            .select({ raw_user_meta_data: profiles.raw_user_meta_data })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.raw_user_meta_data ?? {})
);

export const profile_getCreditsById = query(
    v.string(),
    (id: string) =>
        db()
            .select({ credits: profiles.credits })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.credits ?? -1)
);

export const profile_getCreditsByPhone = query(
    v.string(),
    (phone: string) =>
        db()
            .select({ credits: profiles.credits })
            .from(profiles)
            .where(eq(profiles.phone, phone))
            .limit(1)
            .then(r => r[0]?.credits ?? -1)
);

export const profile_getPhoneById = query(
    v.string(),
    (id: string) =>
        db()
            .select({ phone: profiles.phone })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.phone ?? '')
);

export const profile_getEmailById = query(
    v.string(),
    (id: string) =>
        db()
            .select({ email: profiles.email })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.email ?? '')
);

export const profile_getUserIdByPhone = query(
    v.string(),
    (phone: string) =>
        db()
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.phone, phone))
            .limit(1)
            .then(r => r[0]?.id ?? '')
);

export const profile_phoneExists = query(
    v.string(),
    (phone: string) =>
        db().select().from(profiles)
            .where(eq(profiles.phone, phone)).limit(1)
            .then(r => r.length > 0)
);

export const profile_userExistsByPhone = query(
    v.string(),
    (phone: string) =>
        db().select().from(profiles)
            .where(eq(profiles.phone, phone)).limit(1)
            .then(r => r.length > 0)
);


export const profile_getUserById = query<string, Profile | null>(
    v.string(),
    (id) =>
        db().select().from(profiles)
            .where(eq(profiles.id, id)).limit(1)
            .then((r: unknown[]) => r[0] ?? null)
);

export const profile_getUsersWithCredits = query(() =>
    db().select().from(profiles).where(gt(profiles.credits, 0))
);

export const profile_getUsersWithCreditsByIds = query(
    v.array(v.string()),
    (ids: string[]) =>
        db()
            .select()
            .from(profiles)
            .where(and(gt(profiles.credits, 0), inArray(profiles.id, ids)))
);

export const profile_getAll = query(() => db().select().from(profiles));

// writes
export const profile_create = command(
    ProfileInsertSchema,
    (payload: ProfileInsert) => db().insert(profiles).values(payload)
);

export const profile_update = command(
    v.object({ id: v.string(), data: ProfileUpdateSchema }),
    ({ id, data }: { id: string; data: ProfileUpdate }) =>
        db().update(profiles).set(data).where(eq(profiles.id, id))
            .then(r => r.count > 0)
);

export const profile_remove = command(
    v.string(),
    (id: string) => db().delete(profiles).where(eq(profiles.id, id))
);

export const profile_removeOneCredit = command(
    v.string(),
    (id: string) =>
        db()
            .update(profiles)
            .set({ credits: sql`${profiles.credits} - 1` })
            .where(eq(profiles.id, id)).then(r => r.count > 0)
);

export const profile_prolongSubscription = command(
    v.object({ email: v.string(), days: v.number() }),
    ({ email, days }: EmailDays) => {
        const future = Math.floor((Date.now() + days * 86_400_000) / 1000);
        return db().update(profiles)
            .set({ subscription_expiration_date: future.toString(), credits: 500 })
            .where(eq(profiles.email, email)).then(r => r.count > 0);
    }
);

export const profile_refillCredits = command(
    v.object({ email: v.string(), amount: v.number() }),
    async ({ email, amount }: EmailAmount) => {
        const [user] = await db().select().from(profiles)
            .where(eq(profiles.email, email)).limit(1);
        if (!user) return false;

        const newCredits = (user.credits ?? 0) + amount;
        return db().update(profiles)
            .set({ credits: newCredits })
            .where(eq(profiles.email, email)).then(r => r.count > 0);
    }
);

/*────────────────────── NOTIFICATIONS ───────────────────*/

// write
export const notification_create = command(
    NotificationInsertSchema,
    (payload: NotificationInsert) =>
        db().insert(notifications).values(payload).then(r => r.success)
);

// reads
export const notification_getByArea = query(
    v.string(),
    (area: string) => db().select().from(notifications)
        .where(eq(notifications.area, area))
);

export const notification_getAll = query(() =>
    db().select().from(notifications)
);

export const notification_getLatest = query(
    v.optional(v.number(), 3),
    (count: number = 3) =>
        db().select().from(notifications)
            .orderBy(desc(notifications.date)).limit(count)
);

/*──────────────────────── SERVICES ──────────────────────*/

// read
export const service_getConfig = query(
    v.object({ user: v.string(), name: v.string() }),
    ({ user, name }: UserName) =>
        db().select().from(services)
            .where(and(eq(services.user, user), eq(services.name, name)))
            .limit(1).then(r => r[0] ?? null)
);

export const service_getUserIdsByOptions = query(
    v.object({ key: v.string(), value: v.any() }),
    ({ key, value }: KV) =>
        db().select().from(services)
            .where(sql`options->>'${sql.raw(key)}' = ${value}`)
);

// write
export const service_createOrUpdate = command(
    ServiceInsertSchema,
    async (payload: ServiceInsert) => {
        const { user, name, notificationWithinTime, ...rest } = payload;

        const [existing] = await db().select().from(services)
            .where(and(eq(services.user, user), eq(services.name, name))).limit(1);

        const values = { ...rest, notificationWithinTime: String(notificationWithinTime) };

        const res = existing
            ? await db().update(services).set(values).where(eq(services.id, existing.id))
            : await db().insert(services).values({ user, name, ...values });

        return res.success;
    }
);

export const service_remove = command(
    v.object({ user: v.string(), name: v.string() }),
    ({ user, name }: UserName) =>
        db().delete(services)
            .where(and(eq(services.user, user), eq(services.name, name)))
            .then(r => r.success)
);
