import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';
import { DatabaseManager } from '$lib/server/managers/databasemanager';


export const t = initTRPC.context<Context>().create();
export const appRouter = t.router({

    ping: t.procedure.query(() => {
        return "Pong!";
    }),

    ping2: t.procedure
        .input(z.string())
        .query((async ({ input }) => {
            const email: string = await DatabaseManager.Profiles.getEmailById(input);
            return email;
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
        .query((async ({ input }) => {
            const credits: number = await DatabaseManager.Profiles.getCreditsById(input);
            return credits;
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