<script lang="ts">
	import "../app.css";
	import { isLoggedIn, supabase } from "$lib/Managers/AuthManager";
	import { userLoggedIn } from "$lib/sharedStore";
	/* layout-level UI */
	import HeaderLoggedIn from "$lib/Components/HeaderLoggedIn.svelte";
	import Header from "$lib/Components/Header.svelte";
	import Footer from "$lib/Components/Footer.svelte";
	/* modals */
	import ModalLogin from "$lib/Components/Modal/ModalLogin.svelte";
	import ModalLostPassword from "$lib/Components/Modal/ModalLostPassword.svelte";
	import ModalServices from "$lib/Components/Modal/ModalServices.svelte";
	import ModalRegister from "$lib/Components/Modal/ModalRegister.svelte";
	import ProfileSettingsModal from "$lib/Components/Modal/Profile/ProfileSettingsModal.svelte";
	import { onMount } from "svelte";
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	
	/* ── local reactive state ───────────────────────────── */
	let lastAuthStatus = $state<string>("");
	
	let lastSession = $state<
		ReturnType<typeof supabase.auth.getSession> |
		null
	>(null);
	
	/* receive the child-content snippet that SvelteKit supplies */
	let { children } = $props();
	
	/* ── lifecycle & auth handling ──────────────────────── */
	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
	
	onMount(async () => {
		// selectedLanguage.set($page.data.language); // migrate when ready
		$userLoggedIn = await isLoggedIn();
	});

	if (supabase) {
		supabase.auth.onAuthStateChange((event, session) => {
			lastAuthStatus = event;
			// Store the session directly, since lastSession is typed as ReturnType<typeof supabase.auth.getSession> | null
			lastSession = session ? Promise.resolve({ data: { session }, error: null }) : Promise.resolve({ data: { session: null }, error: null });
			$userLoggedIn = event === "SIGNED_IN";
		})
	}
</script>

<!-- global modals -->
<ModalLogin />
<ModalRegister />
<ModalLostPassword />
<ModalServices />
<ProfileSettingsModal />

<!-- header switches on authentication -->
{#if $userLoggedIn}
	<HeaderLoggedIn />
{:else}
	<Header />
{/if}

<Toaster />

{@render children?.()}

<Footer />
