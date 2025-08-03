import type { Handle, HandleValidationError } from '@sveltejs/kit';
import { initDB, db } from '$lib/db';


export const handleValidationError: HandleValidationError = () => {
	return {
		message: 'Nice try, hacker!'
	};
};

export const handle: Handle = async ({ event, resolve }) => {
	initDB(event.platform.env);
	event.locals.db = db();
	return resolve(event);
};
