import type { Handle, RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';

import { initDB } from '$lib/db';
import { type AuthEnv, createAuth } from './lib/server/auth';
import { getDb } from './lib/server/db';

const loginRoute = '/';
function routeRequiresAuth(_event: RequestEvent) {
	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	// prerendered routes throw an error during building because the build runtime can't access platform.env
	if (building) return resolve(event);

	try {
		const u = new URL(event.request.url);
		console.log('[hooks] incoming request', {
			method: event.request.method,
			path: u.pathname
		});
	} catch {}

	const env = event.platform?.env as unknown as AuthEnv | undefined;
	if (env?.DB) {
		// Initialize global DB instance used by remote functions in `$lib/db`
		initDB(env as unknown as Env);
		event.locals.db = getDb({ d1Binding: env.DB });
		console.log('[hooks] D1 binding detected and initialized');
	}

	if (!env?.DB) {
		console.warn('[hooks] No D1 binding on platform.env');
	}

	const auth = createAuth(
		env,
		event.platform?.cf as unknown as
			| import('better-auth-cloudflare').CloudflareGeolocation
			| undefined
	);
	console.log('[hooks] auth created');

	// Always try to get the session to make it available for layouts
	try {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (session?.user) {
			event.locals.user = session.user;
			event.locals.session = session;
		}
	} catch (e) {
		console.warn('[hooks] Failed to get session:', e);
	}

	// Redirect to login for protected routes
	if (routeRequiresAuth(event) && !event.locals.user) {
		return redirect(302, loginRoute);
	}

	event.locals.auth = auth;

	return resolve(event);
};
