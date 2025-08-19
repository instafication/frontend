import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const POST: RequestHandler = async (event) => {
    const res = await event.locals.auth.handler(event.request);
    if (res.status >= 400) {
        try {
            const body = await res.clone().text();
            console.error(`[BetterAuth] POST ${new URL(event.request.url).pathname} -> ${res.status}: ${body}`);
        } catch { }
    }
    return res;
};
export const PUT: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const DELETE: RequestHandler = async (event) => event.locals.auth.handler(event.request);