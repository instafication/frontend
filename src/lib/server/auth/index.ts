import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import type { CloudflareGeolocation } from 'better-auth-cloudflare';
import { withCloudflare } from 'better-auth-cloudflare';
import { eq } from 'drizzle-orm';
import { getRequestEvent } from '$app/server';

import { getDb } from '$lib/server/db';
import { EmailTemplates, isLocalEnvironment, sendEmail } from '$lib/server/email';
import * as authSchema from '../../../../drizzle/generated.auth.schema';
import { profiles } from '../../../../drizzle/schema';
import { createPbkdf2Hasher } from './pbkdf2';

export type AuthEnv = {
	DB: unknown;
	KV?: unknown;
	BETTER_AUTH_SECRET?: string;
	RESEND_API_KEY?: string;
	ENVIRONMENT?: string;
	PBKDF2_ITERS?: string;
	TRUSTED_ORIGINS?: string;
	MIN_PASSWORD_LENGTH?: string;
};

// Default trusted origins (fallback when env var not set)
const DEFAULT_TRUSTED_ORIGINS = [
	'http://localhost:8787',
	'http://localhost:8787/reset-password',
	'http://127.0.0.1:8787',
	'http://127.0.0.1:8787/reset-password',
	'http://localhost:5173',
	'https://instafication.shop',
	'https://instafication.shop/reset-password',
	'http://instafication.shop'
];

/**
 * Parse trusted origins from environment variable or use defaults
 */
function getTrustedOrigins(env?: AuthEnv): string[] {
	const envOrigins = env?.TRUSTED_ORIGINS;
	if (envOrigins) {
		return envOrigins
			.split(',')
			.map((origin) => origin.trim())
			.filter(Boolean);
	}
	return DEFAULT_TRUSTED_ORIGINS;
}

/**
 * Get minimum password length from environment (default: 8 for prod, 1 for dev)
 */
function getMinPasswordLength(env?: AuthEnv, isDev = false): number {
	const envValue = env?.MIN_PASSWORD_LENGTH;
	if (envValue) {
		const parsed = Number(envValue);
		if (!Number.isNaN(parsed) && parsed > 0) return parsed;
	}
	return isDev ? 1 : 8;
}

// Export for CLI schema generation (env undefined => include drizzleAdapter)
export const createAuth = (env?: AuthEnv, cf?: CloudflareGeolocation | null | undefined) => {
	const isDev = import.meta.env.DEV ?? false;

	// Create PBKDF2 hasher with environment configuration
	const pbkdf2Hasher = createPbkdf2Hasher({
		iterations: Number(env?.PBKDF2_ITERS) || undefined,
		isDev
	});

	const baseOptions: BetterAuthOptions = {
		basePath: '/api/auth',
		secret: env?.BETTER_AUTH_SECRET,
		trustedOrigins: getTrustedOrigins(env),
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
			// Use configurable password length (stricter in prod)
			minPasswordLength: getMinPasswordLength(env, isDev),
			// PBKDF2-HMAC-SHA256 password hashing (Workers-safe)
			password: {
				hash: async (password: string) => pbkdf2Hasher.hash(password),
				verify: async ({ hash, password }: { hash: string; password: string }) =>
					pbkdf2Hasher.verify(hash, password)
			},
			// Forgot password: send email with reset link
			sendResetPassword: async ({ user, url, token: _token }, _request) => {
				const apiKey = (env as any)?.RESEND_API_KEY as string | undefined;
				if (!apiKey) {
					console.error('[BetterAuth] RESEND_API_KEY is missing; cannot send reset email');
					return;
				}

				const template = EmailTemplates.resetPassword(url);
				const result = await sendEmail(
					{ to: user.email, ...template },
					{ apiKey, isLocal: isLocalEnvironment(url) }
				);

				if (!result.success) {
					console.error('[BetterAuth] sendResetPassword failed', result.error);
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
						.where(eq(authSchema.users.email, newEmail))
						.limit(1);
					const currentUserId = ((ctx as any).session as any)?.user?.id as string | undefined;
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
				sendChangeEmailVerification: async ({ user, newEmail, url, token: _token }, _request) => {
					const apiKey = (env as any)?.RESEND_API_KEY as string | undefined;
					if (!apiKey) {
						console.error(
							'[BetterAuth] RESEND_API_KEY is missing; cannot send change-email verification'
						);
						return;
					}

					const template = EmailTemplates.changeEmail(newEmail, url);
					const result = await sendEmail(
						{ to: user.email, ...template },
						{ apiKey, isLocal: isLocalEnvironment(url) }
					);

					if (!result.success) {
						console.error('[BetterAuth] sendChangeEmailVerification failed', result.error);
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
							const existing = await db
								.select()
								.from(profiles)
								.where(eq(profiles.id, user.id))
								.limit(1);
							if (!existing?.length) {
								await db.insert(profiles).values({ id: user.id, email: user.email, credits: 3 });
								console.log('[BetterAuth hook] profile created with default credits', {
									id: user.id
								});
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
							await db.update(profiles).set({ email: user.email }).where(eq(profiles.id, user.id));
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
							const existing = await db
								.select()
								.from(profiles)
								.where(eq(profiles.id, session.userId))
								.limit(1);
							if (!existing?.length) {
								await db.insert(profiles).values({ id: session.userId, credits: 3 });
								console.log('[BetterAuth hook] profile created on session with default credits', {
									id: session.userId
								});
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
	} catch {}

	const auth = betterAuth(options as BetterAuthOptions);

	return auth;
};

// Export for CLI usage to generate schemas when env is not provided
export const auth = createAuth();
