import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../routes/[...api]/router';
import superjson from 'superjson';

export const trpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: "/api",
        }),
    ],
});