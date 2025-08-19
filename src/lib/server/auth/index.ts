import { betterAuth } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';
import { admin, apiKey } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '$lib/server/db';

// Export for CLI schema generation (env undefined => include drizzleAdapter)
export const createAuth = (env?: Env) => {
    const auth = betterAuth({
        ...withCloudflare(
            {
                autoDetectIpAddress: true,
                geolocationTracking: true,
                // Provide D1 database only at runtime
                d1: env
                    ? {
                        db: getDb({ d1Binding: env.DB }),
                        options: {
                            usePlural: true,
                            debugLogs: true
                        }
                    }
                    : undefined,
                // Optional CF resources if bound
                kv: (env as any)?.KV,
                r2: undefined
            },
            {
                basePath: '/api/auth',
                secret: env?.BETTER_AUTH_SECRET,
                emailAndPassword: { enabled: true },
                rateLimit: { enabled: true },
                plugins: [admin(), apiKey()]
            }
        ),
        // Only add database adapter for CLI schema generation
        ...(env
            ? {}
            : {
                database: drizzleAdapter({} as any, {
                    provider: 'sqlite',
                    usePlural: true,
                    debugLogs: true
                })
            })
    });

    return auth;
};

// Export for CLI usage to generate schemas when env is not provided
export const auth = createAuth();


