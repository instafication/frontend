import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';
import type { CloudflareGeolocation } from 'better-auth-cloudflare';
import { admin, apiKey } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '$lib/server/db';

export type AuthEnv = {
    DB: unknown;
    KV?: unknown;
    BETTER_AUTH_SECRET?: string;
};

// Export for CLI schema generation (env undefined => include drizzleAdapter)
export const createAuth = (env?: AuthEnv, cf?: CloudflareGeolocation | null | undefined) => {
    const baseOptions: BetterAuthOptions = {
        basePath: '/api/auth',
        secret: env?.BETTER_AUTH_SECRET,
        emailAndPassword: {
            enabled: true,
            // Allow sign-up/sign-in without requiring email verification
            requireEmailVerification: false
        },
        rateLimit: { enabled: true },
        plugins: [admin(), apiKey()]
    };

    const options = env
        ? withCloudflare(
            {
                // Only enable when running on Cloudflare where `cf` exists
                autoDetectIpAddress: !!cf,
                geolocationTracking: !!cf,
                cf,
                // Provide D1 database only at runtime
                d1: {
                    db: getDb({ d1Binding: env.DB }) as any,
                    options: {
                        usePlural: true,
                        debugLogs: true
                    }
                },
                // Optional CF resources if bound
                kv: (env as any)?.KV,
                r2: undefined
            },
            baseOptions
        )
        : {
            ...baseOptions,
            // Add database adapter for CLI schema generation when no runtime env
            database: drizzleAdapter({} as any, {
                provider: 'sqlite',
                usePlural: true,
                debugLogs: true
            })
        };

    const auth = betterAuth(options as BetterAuthOptions);

    return auth;
};

// Export for CLI usage to generate schemas when env is not provided
export const auth = createAuth();


