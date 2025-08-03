// src/routes/db.remote.ts
//
// ⚡ SvelteKit 2.27 remote functions that wrap every Drizzle call
//    formerly found in DatabaseManager.{Scraper,Profiles,Notifications,Services}
//
// ────────────────────────────────────────────────────────────────────────────────
import { query, command } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { db } from '$lib/db';
import { profiles, services, scrapers, notifications } from '../../../drizzle';
import { eq, gt, and, inArray, desc, sql } from 'drizzle-orm';

/*────────────────────────── SCRAPER ──────────────────────────*/

// read
export const scraper_getLastUpdated = query(
    v.object({ key: v.string(), value: v.any() }),
    ({ key, value }) =>
        db()
            .select({ last_update: scrapers.last_update })
            .from(scrapers)
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .limit(1)
            .then(r => Number(r[0]?.last_update) || -1)
);

export const scraper_getLastUpdateByCompany = query(
    v.string(),
    (company) =>
        db()
            .select({ last_update: scrapers.last_update })
            .from(scrapers)
            .where(eq(scrapers.company, company))
            .orderBy(desc(scrapers.last_update))
            .limit(1)
            .then(r => Number(r[0]?.last_update) || -1)
);

export const scraper_exists = query(
    v.object({ key: v.string(), value: v.any() }),
    ({ key, value }) =>
        db()
            .select()
            .from(scrapers)
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .limit(1)
            .then(r => r.length > 0)
);

export const scraper_getAll = query(async () => db().select().from(scrapers));

// create / update
export const scraper_create = command(
    v.object({
        company: v.string(),
        services: v.optional(v.array(v.string()), []),
        params: v.record(v.string(), v.any()),
        frequency: v.number()
    }),
    async ({ company, services: svc, params, frequency }) => {
        const now = BigInt(Date.now());
        const result = await db().insert(scrapers).values({
            company,
            services: svc,
            last_ping: now,
            last_update: now,
            params,
            frequency
        });
        return result.count > 0;
    }
);

export const scraper_updatePing = command(
    v.object({
        key: v.string(),
        value: v.any(),
        unixTimestamp: v.number()
    }),
    async ({ key, value, unixTimestamp }) =>
        db()
            .update(scrapers)
            .set({ last_ping: BigInt(unixTimestamp) })
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .then(r => r.count > 0)
);

export const scraper_updateLastUpdated = command(
    v.object({
        key: v.string(),
        value: v.any(),
        unixTimestamp: v.number()
    }),
    async ({ key, value, unixTimestamp }) =>
        db()
            .update(scrapers)
            .set({ last_update: BigInt(unixTimestamp) })
            .where(sql`params->>'${sql.raw(key)}' = ${value}`)
            .then(r => r.count > 0)
);

/*────────────────────────── PROFILES ─────────────────────────*/

// simple look-ups
export const profile_getRawUserData = query(v.string(),
    id =>
        db()
            .select({ raw_user_meta_data: profiles.raw_user_meta_data })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.raw_user_meta_data ?? {})
);

export const profile_getCreditsById = query(v.string(),
    id =>
        db()
            .select({ credits: profiles.credits })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.credits ?? -1)
);

export const profile_getCreditsByPhone = query(v.string(),
    phone =>
        db()
            .select({ credits: profiles.credits })
            .from(profiles)
            .where(eq(profiles.phone, phone))
            .limit(1)
            .then(r => r[0]?.credits ?? -1)
);

export const profile_getPhoneById = query(v.string(),
    id =>
        db()
            .select({ phone: profiles.phone })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.phone ?? '')
);

export const profile_getEmailById = query(v.string(),
    id =>
        db()
            .select({ email: profiles.email })
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0]?.email ?? '')
);

export const profile_getUserIdByPhone = query(v.string(),
    phone =>
        db()
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.phone, phone))
            .limit(1)
            .then(r => r[0]?.id ?? '')
);

export const profile_phoneExists = query(v.string(),
    phone =>
        db()
            .select()
            .from(profiles)
            .where(eq(profiles.phone, phone))
            .limit(1)
            .then(r => r.length > 0)
);

export const profile_userExistsByPhone = query(v.string(),
    phone =>
        db()
            .select()
            .from(profiles)
            .where(eq(profiles.phone, phone))
            .limit(1)
            .then(r => r.length > 0)
);

export const profile_getUserById = query(v.string(),
    id =>
        db()
            .select()
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1)
            .then(r => r[0] ?? null)
);

export const profile_getUsersWithCredits = query(async () =>
    db().select().from(profiles).where(gt(profiles.credits, 0))
);

export const profile_getUsersWithCreditsByIds = query(
    v.array(v.string()),
    (ids) =>
        db()
            .select()
            .from(profiles)
            .where(and(gt(profiles.credits, 0), inArray(profiles.id, ids)))
);

export const profile_getAll = query(async () => db().select().from(profiles));

// mutations
export const profile_update = command(
    v.object({ id: v.string(), email: v.string(), phone: v.string() }),
    async ({ id, email, phone }) =>
        db()
            .update(profiles)
            .set({ email, phone })
            .where(eq(profiles.id, id))
            .then(r => r.count > 0)
);

export const profile_remove = command(v.string(),
    id => db().delete(profiles).where(eq(profiles.id, id))
);

export const profile_removeOneCredit = command(v.string(),
    id =>
        db()
            .update(profiles)
            .set({ credits: sql`${profiles.credits} - 1` })
            .where(eq(profiles.id, id))
            .then(r => r.count > 0)
);

export const profile_prolongSubscription = command(
    v.object({ email: v.string(), days: v.number() }),
    async ({ email, days }) => {
        const future = Math.floor((Date.now() + days * 86_400_000) / 1000);
        return db()
            .update(profiles)
            .set({
                subscription_expiration_date: future.toString(),
                credits: 500
            })
            .where(eq(profiles.email, email))
            .then(r => r.count > 0);
    }
);

export const profile_refillCredits = command(
    v.object({ email: v.string(), amount: v.number() }),
    async ({ email, amount }) => {
        const [user] = await db()
            .select()
            .from(profiles)
            .where(eq(profiles.email, email))
            .limit(1);

        if (!user) return false;

        const newCredits = (user.credits ?? 0) + amount;
        return db()
            .update(profiles)
            .set({ credits: newCredits })
            .where(eq(profiles.email, email))
            .then(r => r.count > 0);
    }
);

/*────────────────────────── NOTIFICATIONS ─────────────────────────*/

export const notification_create = command(
    v.object({
        title: v.string(),
        body: v.string(),
        area: v.string(),
        date: v.optional(v.string())
    }),
    async ({ title, body, area, date }) =>
        db()
            .insert(notifications)
            .values({
                title,
                body,
                area,
                date: date ? Number(new Date(date)) : undefined
            })
            .then(r => r.success)
);

export const notification_getByArea = query(v.string(),
    area => db().select().from(notifications).where(eq(notifications.area, area))
);

export const notification_getAll = query(async () => db().select().from(notifications));

export const notification_getLatest = query(
    v.optional(v.number(), 3),
    (count = 3) =>
        db()
            .select()
            .from(notifications)
            .orderBy(desc(notifications.date))
            .limit(count)
);

/*────────────────────────── SERVICES ─────────────────────────*/

export const service_getConfig = query(
    v.object({ user: v.string(), name: v.string() }),
    ({ user, name }) =>
        db()
            .select()
            .from(services)
            .where(and(eq(services.user, user), eq(services.name, name)))
            .limit(1)
            .then(r => r[0] ?? null)
);

export const service_getUserIdsByOptions = query(
    v.object({ key: v.string(), value: v.any() }),
    ({ key, value }) =>
        db().select().from(services).where(sql`options->>'${sql.raw(key)}' = ${value}`)
);

export const service_createOrUpdate = command(
    v.object({
        user: v.string(),
        name: v.string(),
        notificationMethod: v.string(),
        notificationWithinTime: v.number(),
        options: v.record(v.string(), v.any())
    }),
    async ({ user, name, notificationMethod, notificationWithinTime, options }) => {
        const [existing] = await db()
            .select()
            .from(services)
            .where(and(eq(services.user, user), eq(services.name, name)))
            .limit(1);

        let res;
        if (!existing) {
            res = await db().insert(services).values({
                user,
                name,
                notificationMethod,
                notificationWithinTime: notificationWithinTime.toString(),
                options
            });
        } else {
            res = await db()
                .update(services)
                .set({
                    notificationMethod,
                    notificationWithinTime: notificationWithinTime.toString(),
                    options
                })
                .where(eq(services.id, existing.id));
        }
        return res.success;
    }
);

export const service_remove = command(
    v.object({ user: v.string(), name: v.string() }),
    ({ user, name }) =>
        db()
            .delete(services)
            .where(and(eq(services.user, user), eq(services.name, name)))
            .then(r => r.success)
);
