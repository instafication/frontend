import posthog from 'posthog-js';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	if (browser && data.posthogKey && data.posthogHost) {
		posthog.init(data.posthogKey, {
			api_host: data.posthogHost,
			capture_pageview: false,
			capture_pageleave: false,
			capture_exceptions: true
		});
	}

	return data;
}) satisfies LayoutLoad;
