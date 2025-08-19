import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';
import type { CloudflareGeolocation } from 'better-auth-cloudflare';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
// import { admin, apiKey } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '$lib/server/db';
import * as authSchema from '../../../../drizzle/generated.auth.schema';

export type AuthEnv = {
    DB: unknown;
    KV?: unknown;
    BETTER_AUTH_SECRET?: string;
    RESEND_API_KEY?: string;
    ENVIRONMENT?: string;
};

// Export for CLI schema generation (env undefined => include drizzleAdapter)
export const createAuth = (env?: AuthEnv, cf?: CloudflareGeolocation | null | undefined) => {
    const isDev = (import.meta as any)?.env?.DEV ?? false;
    const baseOptions: BetterAuthOptions = {
        basePath: '/api/auth',
        secret: env?.BETTER_AUTH_SECRET,
        trustedOrigins: [
            'http://localhost:8787',
            'http://localhost:8787/reset-password',
            'http://127.0.0.1:8787',
            'http://127.0.0.1:8787/reset-password',
            'http://localhost:5173',
            'https://instafication.shop',
            'https://instafication.shop/reset-password',
            'http://instafication.shop'
        ],
        session: {
            // Keep sessions for 30 days, and refresh expiry daily while active
            expiresIn: 60 * 60 * 24 * 30,
            updateAge: 60 * 60 * 24,
            cookieCache: {
                enabled: true,
                maxAge: 5 * 60
            }
        },
        emailAndPassword: {
            enabled: true,
            // Allow sign-up/sign-in without requiring email verification
            requireEmailVerification: false,
            // Relax password policy for local dev
            minPasswordLength: 1,
            // Forgot password: send email with reset link
            sendResetPassword: async ({ user, url, token }, _request) => {
                const subject = 'Återställ ditt lösenord';
                const body = `
                    <p>Hej!</p>
                    <p>Du har begärt att återställa ditt lösenord hos Instafication.</p>
                    <p>Klicka på länken nedan för att återställa ditt lösenord:</p>
                    <p><a href="${url}">${url}</a></p>
                    <p>Om du inte begärt denna åtgärd kan du ignorera detta mail.</p>
                `;
                try {
                    const { Resend } = await import('resend');
                    const apiKey = (env as any)?.RESEND_API_KEY as string | undefined;
                    if (!apiKey) {
                        console.error('[BetterAuth] RESEND_API_KEY is missing; cannot send reset email');
                        return;
                    }
                    const resend = new Resend(apiKey);
                    const preferredFrom = 'Instafication <no-reply@transactional.instafication.shop>';
                    const fallbackFrom = 'Instafication <onboarding@resend.dev>';

                    try {
                        const r1 = await resend.emails.send({ from: preferredFrom, to: user.email, subject, html: body });
                        console.log('[BetterAuth] reset email sent (preferred domain)', { id: (r1 as any)?.id || null, to: user.email, from: preferredFrom });
                    } catch (err) {
                        console.warn('[BetterAuth] preferred domain send failed, retrying with fallback', err);
                        try {
                            const r2 = await resend.emails.send({ from: fallbackFrom, to: user.email, subject, html: body });
                            console.log('[BetterAuth] reset email sent (fallback domain)', { id: (r2 as any)?.id || null, to: user.email, from: fallbackFrom });
                        } catch (fallbackErr) {
                            console.warn('[BetterAuth] resend SDK fallback failed, using direct fetch', fallbackErr);
                            const res = await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${apiKey}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ from: fallbackFrom, to: user.email, subject, html: body })
                            });
                            const txt = await res.text();
                            console.log('[BetterAuth] resend direct fetch result', { status: res.status, body: txt });
                        }
                    }
                } catch (e) {
                    console.error('[BetterAuth] sendResetPassword failed', e);
                }
            },
            resetPasswordTokenExpiresIn: 60 * 60 // 1 hour
        },
        advanced: {
            useSecureCookies: !isDev,
            defaultCookieAttributes: {
                sameSite: 'lax',
                secure: !isDev
            }
        },
        // Do not send verification emails on sign-up (avoid needing email provider in dev)
        emailVerification: {
            sendOnSignUp: false
        },
        rateLimit: { enabled: true },
        // Ensure cookies are set correctly in SvelteKit responses
        plugins: [sveltekitCookies(getRequestEvent)],
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
                        // Ensure a corresponding profile exists for this user.
                        // This covers users that predate the user.create.after hook
                        // or any edge cases where profile creation failed.
                        try {
                            const db = getDb({ d1Binding: (env as any)?.DB });
                            const { profiles } = await import('../../../../drizzle/schema');
                            const { eq } = await import('drizzle-orm');
                            const existing = await db.select().from(profiles).where(eq(profiles.id, session.userId)).limit(1);
                            if (!existing?.length) {
                                await db.insert(profiles).values({ id: session.userId, credits: 3 });
                                console.log('[BetterAuth hook] profile created on session with default credits', { id: session.userId });
                            }
                        } catch (e) {
                            console.error('[BetterAuth hook] failed to ensure profile on session', e);
                        }
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


