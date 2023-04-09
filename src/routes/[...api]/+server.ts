import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from './context';
import { appRouter } from './router';
import type { RequestHandler } from '@sveltejs/kit';

const trpcHandler = ({ request }) => {
    return fetchRequestHandler({
        endpoint: 'https://blinksms.se/api',
        req: request,
        router: appRouter,
        createContext
    });
}

export const GET = trpcHandler satisfies RequestHandler;
export const POST = trpcHandler satisfies RequestHandler;