import * as trpc from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';
import { DatabaseManager } from '$lib/server/databasemanager';
// import { createPortalByEmail } from '$lib/server/StripeManager';
import superjson from 'superjson';
import type { Scraper } from '$lib/drizzle/types';

interface Service {
    id: string;
    user: string;
    name: string;
    notification: string;
    notificationWithin: number;
    last_checked: number;
    options: {};
}

interface ServiceReturn {
    id: string;
    user: string;
    name: string;
    notification: string;
    notificationWithin: number;
    options: {};
}

export const t = trpc.initTRPC.context<Context>().create({
    transformer: superjson,
});
export const appRouter = t.router({

    ping: t.procedure.query(() => {
        return "Pong!";
    }),
    pingdb: t.procedure.query(async () => {
        const res = await DatabaseManager.Ping();
        return res;
    }),

    get_all_scrapers: t.procedure
        .query(async () => {
            const scrapers: Scraper[] = await DatabaseManager.Scrapers.getAllScrapers();
            return scrapers;
        }),

    // create_customer_portal_session: t.procedure
    //     .input(z.string())
    //     .output(z.string())
    // 	.query(async ({ input }) => {
    //         const portalUrl: string = await createPortalByEmail(input);
    //         return portalUrl;
    // 	}),

    getConfiguration: t.procedure
        .input(
            z.object({
                user: z.string(),
                name: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const { user, name } = input;
            const serviceConfiguration: Service =
                await DatabaseManager.Services.getServiceConfiguration(user, name);
            console.log("[Router] getServiceConfiguration: ");
            console.log(serviceConfiguration);
            /*
                        {
            id: '7e099c64-2f7a-42d9-8566-fcd414d79ca8',
            user: '5736f6cb-f2ad-4424-9baf-2891d58f9c7a',
            name: 'Stockholms Studentbostäder',
            notification: 'Email',
            notificationWithIn: 10800n,
            last_checked: 0n,
            options: { area: 'Jerum' }
            }
            */
            return serviceConfiguration;
        }),

    createService: t.procedure
        .input(
            z.object({
                user: z.string(),
                name: z.string(),
                notificationMethod: z.string(),
                notificationWithinTime: z.number(),
                options: z.record(z.string(), z.unknown()),
            }),
        )
        .query(async ({ input }) => {
            const { user, name, notificationMethod, notificationWithinTime, options } = input;
            await DatabaseManager.Services.createService(
                user,
                name,
                notificationMethod,
                notificationWithinTime,
                options,
            );
            return true;
        }),

    raw_user_meta_data: t.procedure
        .input(z.string())
        .query(async ({ input }) => {
            const rawUserData: {} = await DatabaseManager.Profiles.getRawUserData(
                input,
            );
            return rawUserData;
        }),

    email: t.procedure.input(z.string()).query(async ({ input }) => {
        const email: string = await DatabaseManager.Profiles.getEmailById(input);
        console.log(email);
        return email;
    }),

    phone: t.procedure.input(z.string()).query(async ({ input }) => {
        const phone: string = await DatabaseManager.Profiles.getPhoneById(input);
        return phone;
    }),

    credits: t.procedure
        .input(z.string())
        .output(z.number())
        .query(async ({ input }) => {
            const c: number = await DatabaseManager.Profiles.getCreditsById(input);
            return c;
        }),

    updateprofileById: t.procedure
        .input(
            z.object({
                id: z.string(),
                email: z.string(),
                phone: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const { id, email, phone } = input;
            await DatabaseManager.Profiles.updateProfileById(id, email, phone);
            return true;
        }),

    getAllNotifications: t.procedure.query(async () => {
        const notifications =
            await DatabaseManager.Notifications.getAllNotifications();
        return notifications;
    }),
    getLatestNotifications: t.procedure
        .input(z.number().optional().default(5))
        .query(async ({ input }) => {
            console.log(input);
            const notifications =
                await DatabaseManager.Notifications.getLatestNotifications(input);
            return notifications;
        }),
    
    getLastUpdateByCompany: t.procedure
        .input(z.string())
        .query(async ({ input }) => {
            const company = input;
            const lastUpdate = await DatabaseManager.Scraper.getLastUpdatedByCompany(company);
            return { lastUpdate };
        }),
});


export type AppRouter = typeof appRouter;