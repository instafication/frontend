import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';
import type { CloudflareGeolocation } from 'better-auth-cloudflare';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '$lib/server/db';
import * as authSchema from '../../../../drizzle/generated.auth.schema';
import { subtle as webSubtle, getRandomValues as webGetRandomValues } from '@better-auth/utils/random';

export type AuthEnv = {
    DB: unknown;
    KV?: unknown;
    BETTER_AUTH_SECRET?: string;
    RESEND_API_KEY?: string;
    ENVIRONMENT?: string;
    PBKDF2_ITERS?: string;
};

// Export for CLI schema generation (env undefined => include drizzleAdapter)
export const createAuth = (env?: AuthEnv, cf?: CloudflareGeolocation | null | undefined) => {
    const isDev = (import.meta as any)?.env?.DEV ?? false;
    // Workers-safe PBKDF2-HMAC-SHA256 using Web Crypto via @better-auth/utils (uncrypto)
    function toBase64(data: Uint8Array): string {
        if (typeof Buffer !== 'undefined') return Buffer.from(data).toString('base64');
        let binary = '';
        for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i]);
        // btoa expects binary string
        return btoa(binary);
    }

    function fromBase64(str: string): Uint8Array {
        if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(str, 'base64'));
        const binary = atob(str);
        const out = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
        return out;
    }

    function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
        return diff === 0;
    }

    const pbkdf2Hasher = {
        // Encodes as: pbkdf2$algo=sha256$it=100000$salt=<b64>$dk=<b64>
        hash: async (password: string) => {
            const salt = new Uint8Array(16);
            webGetRandomValues(salt);
            const iterations = Number((env as any)?.PBKDF2_ITERS) || (isDev ? 100_000 : 100_000);
            const hashAlgo = 'SHA-256';
            const dkLen = 32;
            const passwordBytes = new TextEncoder().encode(password);
            const key = await webSubtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveBits']);
            const bits = await webSubtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: hashAlgo }, key, dkLen * 8);
            const derivedKey = new Uint8Array(bits);
            return `pbkdf2$algo=sha256$it=${iterations}$salt=${toBase64(salt)}$dk=${toBase64(derivedKey)}`;
        },
        verify: async (hash: string, password: string) => {
            try {
                if (!hash.startsWith('pbkdf2$')) return false;
                const parts = Object.fromEntries(
                    hash
                        .split('$')
                        .slice(1) // drop 'pbkdf2'
                        .map((kv) => kv.split('='))
                ) as Record<string, string>;
                const iterations = Number(parts.it);
                const salt = fromBase64(parts.salt);
                const expected = fromBase64(parts.dk);
                const passwordBytes = new TextEncoder().encode(password);
                const key = await webSubtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveBits']);
                const bits = await webSubtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, expected.length * 8);
                const derivedKey = new Uint8Array(bits);
                return timingSafeEqualBytes(derivedKey, expected);
            } catch {
                return false;
            }
        }
    };

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
            // PBKDF2-HMAC-SHA256 password hashing (Workers-safe)
            password: {
                hash: async (password: string) => pbkdf2Hasher.hash(password),
                verify: async ({ hash, password }: { hash: string; password: string }) =>
                    pbkdf2Hasher.verify(hash, password)
            },
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
                    const host = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
                    const tokenPreview = typeof token === 'string' ? `${token.slice(0, 6)}…(${token.length})` : 'n/a';
                    console.log('[BetterAuth] reset email debug start', {
                        to: user?.email,
                        url,
                        host,
                        tokenPreview
                    });
                } catch { }
                try {
                    const apiKey = (env as any)?.RESEND_API_KEY as string | undefined;
                    console.log('[BetterAuth] RESEND_API_KEY present?', { present: Boolean(apiKey), length: apiKey?.length ?? 0 });
                    if (!apiKey) {
                        console.error('[BetterAuth] RESEND_API_KEY is missing; cannot send reset email');
                        return;
                    }
                    const preferredFrom = 'Instafication <no-reply@transactional.instafication.shop>';
                    const fallbackFrom = 'Instafication <onboarding@resend.dev>';
                    const payloadPreferred = { from: preferredFrom, to: user.email, subject, html: body };
                    const payloadFallback = { from: fallbackFrom, to: user.email, subject, html: body };

                    async function sendDirect(payload: any) {
                        console.log('[BetterAuth] Resend POST /emails (direct)', { from: payload.from, to: payload.to });
                        const res = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        const txt = await res.text();
                        let json: any = null; try { json = JSON.parse(txt); } catch { }
                        console.log('[BetterAuth] Resend response', { status: res.status, ok: res.ok, id: json?.id ?? null, error: json?.error ?? null, raw: txt });
                        if (!res.ok) throw new Error(`Resend error ${res.status}`);
                        return json;
                    }

                    // In dev, use onboarding sender to avoid unverified domain; in prod, try preferred then fallback
                    const isLocal = /localhost|127\./.test((() => { try { return new URL(url).hostname; } catch { return ''; } })());
                    if (isLocal) {
                        await sendDirect(payloadFallback);
                    } else {
                        try {
                            await sendDirect(payloadPreferred);
                        } catch (e) {
                            console.warn('[BetterAuth] Preferred sender failed, trying fallback', e);
                            await sendDirect(payloadFallback);
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
        hooks: {
            before: createAuthMiddleware(async (ctx) => {
                // Block changing to an email that already exists on another account
                if (ctx.path !== '/change-email') return;
                const newEmail = (ctx.body as any)?.newEmail as string | undefined;
                if (!newEmail) return;
                try {
                    const db = getDb({ d1Binding: (env as any)?.DB });
                    const existing = await db
                        .select()
                        .from(authSchema.users)
                        .where((await import('drizzle-orm')).eq(authSchema.users.email, newEmail))
                        .limit(1);
                    const currentUserId = (ctx.session as any)?.user?.id as string | undefined;
                    if (existing?.length && existing[0]?.id !== currentUserId) {
                        throw new APIError('CONFLICT', {
                            message: 'E‑postadressen används redan.'
                        });
                    }
                } catch (e) {
                    console.warn('[auth hooks.before] uniqueness check failed', e);
                }
            })
        },
        user: {
            changeEmail: {
                enabled: true,
                sendChangeEmailVerification: async ({ user, newEmail, url, token }, _request) => {
                    const subject = 'Bekräfta ändring av e‑post';
                    const body = `
                        <p>Hej!</p>
                        <p>Du har begärt att ändra din e‑post till <strong>${newEmail}</strong>.</p>
                        <p>Klicka på länken nedan för att bekräfta ändringen:</p>
                        <p><a href="${url}">${url}</a></p>
                        <p>Om du inte begärt denna ändring kan du ignorera detta mail.</p>
                    `;
                    try {
                        const host = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
                        const tokenPreview = typeof token === 'string' ? `${token.slice(0, 6)}…(${token.length})` : 'n/a';
                        console.log('[BetterAuth] change-email email debug start', {
                            to: user?.email,
                            newEmail,
                            url,
                            host,
                            tokenPreview
                        });
                    } catch { }
                    try {
                        const apiKey = (env as any)?.RESEND_API_KEY as string | undefined;
                        console.log('[BetterAuth] RESEND_API_KEY present?', { present: Boolean(apiKey), length: apiKey?.length ?? 0 });
                        if (!apiKey) {
                            console.error('[BetterAuth] RESEND_API_KEY is missing; cannot send change-email verification');
                            return;
                        }
                        const preferredFrom = 'Instafication <no-reply@transactional.instafication.shop>';
                        const fallbackFrom = 'Instafication <onboarding@resend.dev>';
                        const payloadPreferred = { from: preferredFrom, to: user.email, subject, html: body };
                        const payloadFallback = { from: fallbackFrom, to: user.email, subject, html: body };

                        async function sendDirect(payload: any) {
                            console.log('[BetterAuth] Resend POST /emails (direct)', { from: payload.from, to: payload.to });
                            const res = await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${apiKey}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            });
                            const txt = await res.text();
                            let json: any = null; try { json = JSON.parse(txt); } catch { }
                            console.log('[BetterAuth] Resend response', { status: res.status, ok: res.ok, id: json?.id ?? null, error: json?.error ?? null, raw: txt });
                            if (!res.ok) throw new Error(`Resend error ${res.status}`);
                            return json;
                        }

                        const isLocal = /localhost|127\./.test((() => { try { return new URL(url).hostname; } catch { return ''; } })());
                        if (isLocal) {
                            await sendDirect(payloadFallback);
                        } else {
                            try {
                                await sendDirect(payloadPreferred);
                            } catch (e) {
                                console.warn('[BetterAuth] Preferred sender failed, trying fallback', e);
                                await sendDirect(payloadFallback);
                            }
                        }
                    } catch (e) {
                        console.error('[BetterAuth] sendChangeEmailVerification failed', e);
                    }
                }
            }
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
                },
                update: {
                    after: async (user: any) => {
                        // Keep profile email in sync with auth users table
                        try {
                            const db = getDb({ d1Binding: (env as any)?.DB });
                            const { profiles } = await import('../../../../drizzle/schema');
                            const { eq } = await import('drizzle-orm');
                            await db
                                .update(profiles)
                                .set({ email: user.email })
                                .where(eq(profiles.id, user.id));
                        } catch (e) {
                            console.error('[BetterAuth hook] failed to sync profile email on user.update', e);
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


