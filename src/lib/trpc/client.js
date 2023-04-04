import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
export const trpc = createTRPCProxyClient({
    links: [
        httpBatchLink({
            url: 'http://127.0.0.1:5173/api/trpc',
        }),
    ],
});
//# sourceMappingURL=client.js.map