<script lang="ts">
import '../app.css';
import posthog from 'posthog-js';
import { onMount } from 'svelte';
import { browser } from '$app/environment';
import { afterNavigate, beforeNavigate } from '$app/navigation';
import Footer from '$lib/Components/Footer.svelte';
import Header from '$lib/Components/Header.svelte';
import HeaderLoggedIn from '$lib/Components/HeaderLoggedIn.svelte';
import ModalLogin from '$lib/Components/Modal/ModalLogin.svelte';
import ModalLostPassword from '$lib/Components/Modal/ModalLostPassword.svelte';
import ModalRegister from '$lib/Components/Modal/ModalRegister.svelte';
import ModalServices from '$lib/Components/Modal/ModalServices.svelte';
import ProfileSettingsModal from '$lib/Components/Modal/Profile/ProfileSettingsModal.svelte';
import { Toaster } from '$lib/Components/ui/sonner';
import { isLoggedIn } from '$lib/Managers/AuthManager';
import { userLoggedIn } from '$lib/sharedStore';

const { children, data } = $props();

// Initialize with server-provided auth state to avoid hydration mismatch
if (data?.isAuthenticated !== undefined) {
	userLoggedIn.set(data.isAuthenticated);
}

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
