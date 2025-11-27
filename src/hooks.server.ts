import { building } from '$app/environment';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

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
		initDB(env as AuthEnv);
		event.locals.db = getDb({ d1Binding: env.DB });
		console.log('[hooks] D1 binding detected and initialized');
	}

	if (!env?.DB) {
		console.warn('[hooks] No D1 binding on platform.env');
	}

	const auth = createAuth(env, event.platform?.cf);
	console.log('[hooks] auth created');

	if (routeRequiresAuth(event)) {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session || !session.user) {
			return redirect(302, loginRoute);
		}
		event.locals.user = session.user;
	}

	event.locals.auth = auth;

	return resolve(event);
};
