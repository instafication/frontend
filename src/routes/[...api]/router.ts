import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';
import { DatabaseManager } from '$lib/server/managers/databasemanager';


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

export const t = initTRPC.context<Context>().create();
export const appRouter = t.router({

    ping: t.procedure.query(() => {
        return "Pong!";
    }),

    getConfiguration: t.procedure
        .input(z.object({
            user: z.string(),
            name: z.string(),
        }))
        .query((async ({ input }) => {
            const { user, name } = input;
            const serviceConfiguration: Service = await DatabaseManager.Services.getServiceConfiguration(user, name);
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
            return serviceConfiguration
        })),


    createService: t.procedure
        .input(z.object({
            user: z.string(),
            name: z.string(),
            notification: z.string(),
            notificationWithin: z.string(),
            options: z.record(z.unknown()),
        }))
        .query((async ({ input }) => {
            const { user, name, notification, notificationWithin, options } = input;
            await DatabaseManager.Services.createService(user, name, notification, notificationWithin, options);
            return true;
        }
        )),


    raw_user_meta_data: t.procedure
        .input(z.string())
        .query((async ({ input }) => {
            const rawUserData: {} = await DatabaseManager.Profiles.getRawUserData(input);
            return rawUserData;
        })),

    email: t.procedure
        .input(z.string())
        .query((async ({ input }) => {
            const email: string = await DatabaseManager.Profiles.getEmailById(input);
            return email;
        })),

    phone: t.procedure
        .input(z.string())
        .query((async ({ input }) => {
            const phone: string = await DatabaseManager.Profiles.getPhoneById(input);
            return phone;
        })),

    credits: t.procedure
        .input(z.string())
        .output(z.number())
        .query((async ({ input }) => {
            const c: number = await DatabaseManager.Profiles.getCreditsById(input);
            return c;
        })),

    updateprofileById: t.procedure
        .input(z.object({
            id: z.string(),
            email: z.string(),
            phone: z.string()
        }))
        .query((async ({ input }) => {
            const { id, email, phone } = input;
            await DatabaseManager.Profiles.updateProfileById(id, email, phone);
            return true;
        }
        )),


    getAllNotifications: t.procedure.query(async () => {
        const notifications = await DatabaseManager.Notifications.getAllNotifications();
        return notifications;
    }),
    getLatestNotifications: t.procedure
        .input(z.number().optional().default(5))
        .query(async ({ input }) => {
            console.log(input)
            const notifications = await DatabaseManager.Notifications.getLatestNotifications(input);
        return notifications;
    }),


});


export type AppRouter = typeof appRouter;