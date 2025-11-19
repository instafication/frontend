import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/public';

export const load = (async () => {
	return {
		posthogKey: env.PUBLIC_POSTHOG_KEY ?? null,
		posthogHost: env.PUBLIC_POSTHOG_HOST ?? null
	};
}) satisfies LayoutServerLoad;
