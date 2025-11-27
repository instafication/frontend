<script lang="ts">
import '../app.css';
import { browser } from '$app/environment';
import { afterNavigate, beforeNavigate } from '$app/navigation';
import { isLoggedIn } from '$lib/Managers/AuthManager';
import posthog from 'posthog-js';
import { onMount } from 'svelte';

const { children } = $props();
const _lastAuthStatus = $state('');
const _lastSession = $state<any | null>(null);

if (browser) {
	beforeNavigate(() => posthog.capture('$pageleave'));
	afterNavigate(() => posthog.capture('$pageview'));
}

onMount(async () => {
	$userLoggedIn = await isLoggedIn();
	// touch session to refresh expiry (sliding window)
	try {
		await isLoggedIn();
	} catch {}
});

// BetterAuth client does not expose an auth state listener here; we rely on page reload and explicit store updates.
</script>

<ModalLogin />
<ModalRegister />
<ModalLostPassword />
<ModalServices />
<ProfileSettingsModal />

{#if $userLoggedIn}
	<HeaderLoggedIn />
{:else}
	<Header />
{/if}

<Toaster />

{@render children?.()}

<Footer />
