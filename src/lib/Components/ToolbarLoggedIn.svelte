<script lang="ts">

import { json } from '@sveltejs/kit';
import { Navbar,NavHamburger,  NavBrand,  Toolbar, ToolbarButton, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider, ButtonGroup, Button } from 'flowbite-svelte'
import ProfileSettingsModal from '$lib/Components/Modal/Profile/ProfileSettingsModal.svelte';
import { getUserId, signOut, supabase } from '$lib/Managers/AuthManager';
import { page } from '$app/stores';
import { trpc } from '$lib/trpc/client';
import { onMount } from 'svelte';
import NotificationDropdown from './Modal/NotificationDropdown.svelte';
import ModalServices from './Modal/ModalServices.svelte';


  let userId: string = "";
  let email: string = "";
  let phone: string = "";
  let credits: number = 0;
  let rawUserMetaData: {} = {};
  async function parseUserData() {
    userId = await getUserId();    
    email = await trpc.email.query(userId);
    phone = await trpc.phone.query(userId);
    credits = await trpc.credits.query(userId);

    console.log("[layout.svelte] User ID: " + userId);
    console.log("[layout.svelte] User email: " + email);
    console.log("[layout.svelte] User phone: " + phone);
    console.log("[layout.svelte] User credits: " + credits);

    rawUserMetaData = await trpc.raw_user_meta_data.query(userId);
    console.log(rawUserMetaData);

  }
  onMount(async () => {
    parseUserData();
  })

  
  let showServicesModal: boolean = false;
  let showProfileSettingsModal: boolean = false;

</script>

<ModalServices bind:showServicesModal />
<ProfileSettingsModal bind:showProfileSettingsModal />

<Navbar let:hidden let:toggle>

  <NavBrand href="/">
    <img src="images/logo.png" class="mr-3 h-6 sm:h-9" alt="BlinkSMS Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BlinkSMS</span>
  </NavBrand>


  <div class="flex items-center md:order-1">


      <!-- <ButtonGroup class="border-0">
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-gray-700 dark:text-green-500"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          Proflie
        </Button>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-gray-700 dark:text-green-500"><path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg>
          Settings
        </Button>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-gray-700 dark:text-green-500"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
          Messages
        </Button>
        <Button>
              <Toolbar color="blue">
  <ToolbarButton color="blue">


            <NotificationDropdown />
    </ToolbarButton>
    <ToolbarButton slot="end"color="blue">
        <Avatar id="avatar-menu" src="{rawUserMetaData.avatar_url || 'images/logo.png'}" />
    </ToolbarButton>
</Toolbar>
        </Button>
      </ButtonGroup> -->

    <Toolbar >

      <NotificationDropdown />
      <Avatar id="avatar-menu" src="{rawUserMetaData.avatar_url || 'images/logo.png'}" />

</Toolbar>

  <Dropdown placement="bottom" triggeredBy="#avatar-menu">
    <DropdownHeader>
      <span class="block text-sm">
<!-- <lord-icon
    src="https://cdn.lordicon.com/tkgyrmwc.json"
    trigger="hover"
    style="width:32px;height:32px">
</lord-icon> -->
        {email}</span>
      <span class="block text-sm">
    <!-- <lord-icon
        src="https://cdn.lordicon.com/qhviklyi.json"
        trigger="hover"
        style="width:24px;height:24px">
      </lord-icon> -->
       <span>Krediter: {credits}</span>
    </DropdownHeader>
    <!-- <DropdownItem on:click={() => showProfileSettingsModal = true}>Telefon</DropdownItem> -->
    <DropdownItem on:click={() => showServicesModal = true}>Tjänster</DropdownItem>
    <DropdownItem on:click={() => showProfileSettingsModal = true}>Inställningar</DropdownItem>
    <DropdownDivider />
    <DropdownItem on:click={async() => {await signOut()}}>Logga ut</DropdownItem>
  </Dropdown>
    <NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1"/>
  </div>

</Navbar>


