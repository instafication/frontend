import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';
import type { CloudflareGeolocation } from 'better-auth-cloudflare';
// import { admin, apiKey } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '$lib/server/db';
import * as authSchema from '../../../../drizzle/generated.auth.schema';

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
            requireEmailVerification: false,
            // Relax password policy for local dev
            minPasswordLength: 1
        },
        // Do not send verification emails on sign-up (avoid needing email provider in dev)
        emailVerification: {
            sendOnSignUp: false
        },
        rateLimit: { enabled: true },
        plugins: [],
        // Deep debug logging
        databaseHooks: {
            user: {
                create: {
                    before: async (user: any) => {
                        console.log('[BetterAuth hook] user.create.before', {
                            email: user?.email,
                            name: user?.name,
                            role: (user as any)?.role
                        });
                        return { data: user };
                    },
                    after: async (user: any) => {
                        console.log('[BetterAuth hook] user.create.after', {
                            id: user?.id,
                            email: user?.email
                        });
                        try {
                            const db = getDb({ d1Binding: (env as any)?.DB });
                            const { profiles } = await import('../../../../drizzle/schema');
                            const { eq } = await import('drizzle-orm');
                            const existing = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
                            if (!existing?.length) {
                                await db.insert(profiles).values({ id: user.id, email: user.email, credits: 3 });
                                console.log('[BetterAuth hook] profile created with default credits', { id: user.id });
                            }
                        } catch (e) {
                            console.error('[BetterAuth hook] failed to create default profile', e);
                        }
                    }
                }
            },
            account: {
                create: {
                    before: async (account: any) => {
                        console.log('[BetterAuth hook] account.create.before', {
                            providerId: account?.providerId,
                            accountId: account?.accountId,
                            hasPassword: Boolean(account?.password)
                        });
                        return { data: account };
                    },
                    after: async (account: any) => {
                        console.log('[BetterAuth hook] account.create.after', {
                            id: account?.id,
                            providerId: account?.providerId
                        });
                    }
                }
            },
            session: {
                create: {
                    before: async (session: any) => {
                        console.log('[BetterAuth hook] session.create.before', {
                            userId: session?.userId,
                            expiresAt: session?.expiresAt
                        });
                        return { data: session };
                    },
                    after: async (session: any) => {
                        console.log('[BetterAuth hook] session.create.after', {
                            id: session?.id,
                            userId: session?.userId
                        });
                    }
                }
            }
        },
        onAPIError: {
            throw: false,
            onError: (error: unknown, ctx: any) => {
                console.error('[BetterAuth onAPIError]', {
                    error,
                    path: ctx?.path,
                    action: ctx?.action
                });
            }
        }
    };

    const options = env
        ? withCloudflare(
            {
                // Disable auto IP + geolocation enrichment to avoid requiring extra session columns
                autoDetectIpAddress: false,
                geolocationTracking: false,
                cf,
                // Provide D1 database only at runtime
                d1: {
                    db: getDb({ d1Binding: env.DB }) as any,
                    options: {
                        usePlural: true,
                        debugLogs: true,
                        schema: authSchema as any
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
                debugLogs: true,
                schema: authSchema as any
            })
        };

    try {
        console.log('[auth] baseOptions snapshot', {
            basePath: baseOptions.basePath,
            emailAndPassword: baseOptions.emailAndPassword?.enabled,
            rateLimit: baseOptions.rateLimit?.enabled
        });
        console.log('[auth] adapter options (cloudflare d1)', {
            usePlural: (options as any)?.database?.options?.usePlural ?? (options as any)?.usePlural,
            hasSchema: Boolean((options as any)?.database?.options?.schema || (options as any)?.schema)
        });
    } catch { }

    const auth = betterAuth(options as BetterAuthOptions);

    return auth;
};

// Export for CLI usage to generate schemas when env is not provided
export const auth = createAuth();


