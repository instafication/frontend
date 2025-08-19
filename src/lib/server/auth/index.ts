import { betterAuth } from 'better-auth';
import { admin, apiKey, twoFactor } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '$lib/server/db';

export const createAuth = (env: Env) => {
    const db = getDb({ d1Binding: env.DB });

    const auth = betterAuth({
        basePath: '/api/auth',
        secret: env.BETTER_AUTH_SECRET,
        database: drizzleAdapter(db, {
            provider: 'sqlite'
        }),
        plugins: [admin(), apiKey(), twoFactor()]
    });

    return auth;
};


