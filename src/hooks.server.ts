import type { Handle } from '@sveltejs/kit';
import { initDB, db } from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
	initDB(event.platform.env);
	event.locals.db = db();
	return resolve(event);
};
