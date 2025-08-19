<script lang="ts">
	import '../app.css';
	import { isLoggedIn } from '$lib/Managers/AuthManager';
	import { userLoggedIn } from '$lib/sharedStore';
	import HeaderLoggedIn from '$lib/Components/HeaderLoggedIn.svelte';
	import Header from '$lib/Components/Header.svelte';
	import Footer from '$lib/Components/Footer.svelte';
	import ModalLogin from '$lib/Components/Modal/ModalLogin.svelte';
	import ModalLostPassword from '$lib/Components/Modal/ModalLostPassword.svelte';
	import ModalServices from '$lib/Components/Modal/ModalServices.svelte';
	import ModalRegister from '$lib/Components/Modal/ModalRegister.svelte';
	import ProfileSettingsModal from '$lib/Components/Modal/Profile/ProfileSettingsModal.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';
	import { Toaster } from '$lib/Components/ui/sonner/index.js';

	let { children } = $props();
	let lastAuthStatus = $state('');
	let lastSession = $state<any | null>(null);

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	onMount(async () => {
		$userLoggedIn = await isLoggedIn();
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
