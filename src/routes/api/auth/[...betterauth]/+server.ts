import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const POST: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const PUT: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const DELETE: RequestHandler = async (event) => event.locals.auth.handler(event.request);