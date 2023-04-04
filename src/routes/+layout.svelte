<script lang="ts">

  import "../app.postcss";
  import HeaderLoggedIn from '$lib/Components/ToolbarLoggedIn.svelte';
  import Header from '$lib/Components/Header.svelte';
  import Footer from '$lib/Components/Footer.svelte';
	import { getUserId, supabase } from "../lib/Managers/AuthManager";
	import { trpc } from "$lib/trpc/client";

  ///============= PWA SUPPORT =============///
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'

  let ReloadPrompt: any;
  onMount(async () => {
    pwaInfo && (ReloadPrompt = (await import('$lib/Components/ReloadPrompt.svelte')).default)
  })

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''  

  // onMount(async () => {
  //     if (pwaInfo) {
  //       const { registerSW } = await import('virtual:pwa-register')
  //       registerSW({
  //         immediate: true,
  //         onRegistered(r) {
  //           // uncomment following code if you want check for updates
  //           r && setInterval(() => {
  //              console.log('Checking for sw update')
  //              r.update()
  //           }, 20000 /* 20s for testing purposes */)
  //           console.log(`SW Registered: ${r}`)
  //         },
  //         onRegisterError(error) {
  //           console.log('SW registration error', error)
  //         }
  //       })
  //     }
  //   })
    
  //   $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

  ///============= [PWA SUPPORT END] =============///







  let lastAuthStatus = "";
  let lastSession = null;

  supabase.auth.onAuthStateChange((event, session) => {
    
  
    console.log(event, session);
    lastAuthStatus = event;
    lastSession = session;

    if (event == 'SIGNED_OUT') {
      console.log('SIGNED_OUT', session)
    } else if (event == 'SIGNED_IN') {
      console.log('SIGNED_IN', session)
    } else if (event == 'USER_UPDATED') {
      console.log('USER_UPDATED', session)
    } else if (event == 'PASSWORD_RECOVERY') {
      console.log('PASSWORD_RECOVERY', session)
    } else if (event == 'PASSWORD_RESET') {
      console.log('PASSWORD_RESET', session)
    } else if (event == 'USER_DELETED') {
      console.log('USER_DELETED', session)
    } else if (event == 'PROFILE_UPDATED') {
      console.log('PROFILE_UPDATED', session)
    } else if (event == 'EMAIL_VERIFIED') {
      console.log('EMAIL_VERIFIED', session)
    }
  })

</script>


<svelte:head>
    {@html webManifest}
</svelte:head>

{#if lastAuthStatus == "SIGNED_IN"}
  <HeaderLoggedIn/>
{:else}
  <Header />
{/if}
<slot></slot>
<Footer/>


{#if ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}