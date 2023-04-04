<script lang="ts">

  import "../app.postcss";
  import HeaderLoggedIn from '$lib/Components/ToolbarLoggedIn.svelte';
  import Header from '$lib/Components/Header.svelte';
  import Footer from '$lib/Components/Footer.svelte';
	import { getUserId, supabase } from "../lib/Managers/AuthManager";
	import { trpc } from "$lib/trpc/client";

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



{#if lastAuthStatus == "SIGNED_IN"}
  <HeaderLoggedIn/>
{:else}
  <Header />
{/if}
<slot></slot>
<Footer/>

