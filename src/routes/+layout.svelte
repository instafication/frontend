<script lang="ts">
	import '../app.css';
	import { isLoggedIn, supabase } from '$lib/Managers/AuthManager';
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
	let lastSession = $state<Awaited<
		ReturnType<NonNullable<typeof supabase>['auth']['getSession']>
	> | null>(null);

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	onMount(async () => {
		$userLoggedIn = await isLoggedIn();
	});

	if (supabase) {
		supabase.auth.onAuthStateChange((event, session) => {
			lastAuthStatus = event;

			if (session) {
				lastSession = {
					data: { session },
					error: null
				};
			} else {
				lastSession = {
					data: { session: null },
					error: null
				};
			}
			$userLoggedIn = event === 'SIGNED_IN';
		});
	}
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
