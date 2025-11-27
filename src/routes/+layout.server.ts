import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// Check if user is authenticated via session
	let isAuthenticated = false;
	try {
		if (locals.auth) {
			// We can't easily get session here without request headers,
			// but we can check if user was set by hooks
			isAuthenticated = Boolean(locals.user);
		}
	} catch (e) {
		console.error('[layout.server] Error checking auth:', e);
	}

	return {
		posthogKey: env.PUBLIC_POSTHOG_KEY ?? null,
		posthogHost: env.PUBLIC_POSTHOG_HOST ?? null,
		isAuthenticated
	};
}) satisfies LayoutServerLoad;
