import posthog, { type PostHog } from 'posthog-node';
import { env } from '$env/dynamic/public';

let _client: PostHog | null = null;
const PUBLIC_POSTHOG_KEY = env.PUBLIC_POSTHOG_KEY;
const PUBLIC_POSTHOG_HOST = env.PUBLIC_POSTHOG_HOST;

export function getPostHogClient(): PostHog {
	if (!PUBLIC_POSTHOG_KEY || !PUBLIC_POSTHOG_HOST) {
		throw new Error('PostHog environment variables are not configured.');
	}

	if (!_client) {
		_client = new posthog.PostHog(PUBLIC_POSTHOG_KEY, {
			host: PUBLIC_POSTHOG_HOST
		});
	}
	return _client;
}
