import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../routes/[...api]/router';

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'https://blinksms.se/api',
        }),
    ],
});