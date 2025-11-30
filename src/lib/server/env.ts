/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 */
import * as v from 'valibot';

/**
 * Schema for frontend environment variables
 */
const FrontendEnvSchema = v.object({
	// Required
	DB: v.unknown(), // D1 database binding
	BETTER_AUTH_SECRET: v.pipe(
		v.string(),
		v.minLength(16, 'BETTER_AUTH_SECRET must be at least 16 characters')
	),

	// Optional but recommended for production
	RESEND_API_KEY: v.optional(v.string()),
	ENVIRONMENT: v.optional(v.picklist(['development', 'production', 'staging'])),

	// Public keys (can be empty in dev)
	PUBLIC_POSTHOG_KEY: v.optional(v.string()),
	PUBLIC_POSTHOG_HOST: v.optional(v.string()),

	// Stripe (optional)
	STRIPE_PUBLISHABLE_KEY: v.optional(v.string()),
	STRIPE_SECRET_KEY: v.optional(v.string()),
	STRIPE_WEBHOOK_SECRET: v.optional(v.string())
});

export type FrontendEnv = v.InferOutput<typeof FrontendEnvSchema>;

/**
 * Validates environment variables and returns typed env object
 * @throws Error if required variables are missing or invalid
 */
export function validateEnv(env: unknown): FrontendEnv {
	const result = v.safeParse(FrontendEnvSchema, env);

	if (!result.success) {
		const issues = result.issues
			.map((issue) => `  - ${issue.path?.map((p) => p.key).join('.')}: ${issue.message}`)
			.join('\n');
		throw new Error(`Environment validation failed:\n${issues}`);
	}

	return result.output;
}

/**
 * Validates environment and logs warnings for missing optional vars
 */
export function validateEnvWithWarnings(env: unknown): FrontendEnv {
	const validatedEnv = validateEnv(env);

	// Warn about missing optional but recommended vars in production
	if (validatedEnv.ENVIRONMENT === 'production') {
		if (!validatedEnv.RESEND_API_KEY) {
			console.warn('[env] RESEND_API_KEY is not set - email functionality will not work');
		}
		if (!validatedEnv.STRIPE_SECRET_KEY) {
			console.warn('[env] STRIPE_SECRET_KEY is not set - payment functionality will not work');
		}
	}

	return validatedEnv;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(env: FrontendEnv): boolean {
	return env.ENVIRONMENT !== 'production';
}
