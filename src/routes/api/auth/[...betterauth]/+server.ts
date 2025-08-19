import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const POST: RequestHandler = async (event) => {
    // Log sanitized request body for debugging
    try {
        const reqBody = await event.request.clone().json().catch(() => null as any);
        if (reqBody && typeof reqBody === 'object') {
            const { password, ...rest } = reqBody as any;
            console.log('[Auth POST debug] Incoming body', { ...rest, password: password ? '***' : undefined });
        }
    } catch { }

    const res = await event.locals.auth.handler(event.request);
    if (res.status >= 400) {
        try {
            const body = await res.clone().text();
            console.error(`[BetterAuth] POST ${new URL(event.request.url).pathname} -> ${res.status}: ${body}`);
        } catch { }
    } else {
        console.log(`[BetterAuth] POST ${new URL(event.request.url).pathname} -> ${res.status}`);
    }
    return res;
};
export const PUT: RequestHandler = async (event) => event.locals.auth.handler(event.request);
export const DELETE: RequestHandler = async (event) => event.locals.auth.handler(event.request);