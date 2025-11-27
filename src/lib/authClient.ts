import { cloudflareClient } from 'better-auth-cloudflare/client';
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
	plugins: [cloudflareClient()]
});

export default authClient;
