import type { Handle, RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';

import { getDb } from './lib/server/db';
import { createAuth } from './lib/server/auth';

const loginRoute = '/';
function routeRequiresAuth(_event: RequestEvent) {
	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	// prerendered routes throw an error during building because the build runtime can't access platform.env
	if (building) return resolve(event);

	const { DB } = event.platform!.env;

	event.locals.db = getDb({ d1Binding: DB! });

	const auth = createAuth(event.platform!.env);

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
}