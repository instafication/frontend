<script lang="ts">
import '../app.css';
import posthog from 'posthog-js';
import { onMount } from 'svelte';
import { browser } from '$app/environment';
import { afterNavigate, beforeNavigate } from '$app/navigation';
import Footer from '$lib/components/Footer.svelte';
import Header from '$lib/components/Header.svelte';
import HeaderLoggedIn from '$lib/components/HeaderLoggedIn.svelte';
import ModalLogin from '$lib/components/Modal/ModalLogin.svelte';
import ModalLostPassword from '$lib/components/Modal/ModalLostPassword.svelte';
import ModalRegister from '$lib/components/Modal/ModalRegister.svelte';
import ModalServices from '$lib/components/Modal/ModalServices.svelte';
import ProfileSettingsModal from '$lib/components/Modal/Profile/ProfileSettingsModal.svelte';
import { Toaster } from '$lib/components/ui/sonner';
import { isLoggedIn } from '$lib/managers/AuthManager';
import { userLoggedIn } from '$lib/sharedStore';

const { children, data } = $props();

// Initialize with server-provided auth state to avoid hydration mismatch
$effect(() => {
	if (data?.isAuthenticated !== undefined) {
		userLoggedIn.set(data.isAuthenticated);
	}
});

if (browser) {
	beforeNavigate(() => posthog.capture('$pageleave'));
	afterNavigate(() => posthog.capture('$pageview'));
}

onMount(async () => {
	// Re-check auth state on client for accuracy (in case cookie state changed)
	const loggedIn = await isLoggedIn();
	$userLoggedIn = loggedIn;
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
