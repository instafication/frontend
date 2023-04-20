<script lang="ts">

  import "../app.postcss";
  import { isLoggedIn, supabase } from "$lib/Managers/AuthManager";
  import { onMount } from 'svelte';
  import { selectedLanguage, userLoggedIn } from '$lib/sharedStore';
  import { page } from '$app/stores';
  import HeaderLoggedIn from '$lib/Components/HeaderLoggedIn.svelte';
  import Header from '$lib/Components/Header.svelte';
  import Footer from '$lib/Components/Footer.svelte';
  import ModalLogin from "$lib/Components/Modal/ModalLogin.svelte";
  import ModalLostPassword from "$lib/Components/Modal/ModalLostPassword.svelte";
  import ModalServices from "$lib/Components/Modal/ModalServices.svelte";
  import ModalRegister from "$lib/Components/Modal/ModalRegister.svelte";
  import ProfileSettingsModal from "$lib/Components/Modal/Profile/ProfileSettingsModal.svelte";
  import type { RequestEvent } from "@sveltejs/kit";
  import { inject } from '@vercel/analytics';

  // Vercel Analytics.
  inject();


  let lastAuthStatus = "";
  let lastSession = null;

  onMount(async () => {
    //selectedLanguage.set($page.data.language);
    $userLoggedIn = await isLoggedIn();
  })

  supabase.auth.onAuthStateChange(async (event, session) => {
      
    lastAuthStatus = event;
    lastSession = session;

    //console.log("event", event)
    //console.log("session", session);

    if (event == 'SIGNED_OUT') {
      $userLoggedIn = false;
    } else if (event == 'SIGNED_IN') {
      $userLoggedIn = true;
    }
    
  })

</script>


<ModalLogin/>
<ModalRegister/>
<ModalLostPassword/>
<ModalServices/>
<ProfileSettingsModal/>


{#if $userLoggedIn}
  <HeaderLoggedIn/>
{:else}
  <Header />
{/if}
<slot></slot>
<Footer/>
