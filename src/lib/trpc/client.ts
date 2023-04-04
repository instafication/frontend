import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../routes/[...api]/router';

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://127.0.0.1:8788/api',
        }),
    ],
});