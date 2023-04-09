<script lang="ts">

  import "../app.postcss";
  import HeaderLoggedIn from '$lib/Components/ToolbarLoggedIn.svelte';
  import Header from '$lib/Components/Header.svelte';
  import Footer from '$lib/Components/Footer.svelte';
	import { getUserId, isLoggedIn, supabase } from "../lib/Managers/AuthManager";
	import { trpc } from "$lib/trpc/client";
  import { onMount } from 'svelte';


  let lastAuthStatus = "";
  let lastSession = null;
  let userLoggedIn: boolean = false; 
  onMount(async () => {
    userLoggedIn = await isLoggedIn();
  })



supabase.auth.onAuthStateChange(async (event, session) => {
      
    lastAuthStatus = event;
    lastSession = session;

    console.log("event", event)
    console.log("session", session);

    if (event == 'SIGNED_OUT') {
      console.log('SIGNED_OUT', session)
      userLoggedIn = false;
    } else if (event == 'SIGNED_IN') {
      console.log('SIGNED_IN', session)
      userLoggedIn = true;
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


{#if userLoggedIn}
  <HeaderLoggedIn/>
{:else}
  <Header />
{/if}
<slot></slot>
<Footer/>
