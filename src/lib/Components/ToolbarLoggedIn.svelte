<script lang="ts">
import { Navbar,NavHamburger,  NavBrand,  Toolbar, ToolbarButton, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte'
import ProfileSettingsModal from '$lib/Components/Modal/Profile/ProfileSettingsModal.svelte';
import { getUserId, signOut, supabase } from '$lib/Managers/AuthManager';
import { page } from '$app/stores';
import { trpc } from '$lib/trpc/client';
import { onMount } from 'svelte';
import NotificationDropdown from './Modal/NotificationDropdown.svelte';
import ToolbarLoggedIn from './ToolbarLoggedIn.svelte';

  let userId: string = "";
  let email: string = "";
  let phone: string = "";
  let credits: number = 0;
  async function parseUserData() {
    userId = await getUserId();    
    email = await trpc.email.query(userId);
    phone = await trpc.phone.query(userId);
    credits = await trpc.credits.query(userId);

    console.log("[layout.svelte] User ID: " + userId);
    console.log("[layout.svelte] User email: " + email);
    console.log("[layout.svelte] User phone: " + phone);
    console.log("[layout.svelte] User credits: " + credits);

  }
  onMount(async () => {
    parseUserData();
  })


  let showProfileSettingsModal = false;
</script>


<ProfileSettingsModal bind:showProfileSettingsModal />

<Navbar let:hidden let:toggle>

  <NavBrand href="/">
    <img src="images/logo.png" class="mr-3 h-6 sm:h-9" alt="BlinkSMS Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BlinkSMS</span>
  </NavBrand>

  <div class="flex items-center md:order-1">
    <Toolbar color="blue">
  <ToolbarButton color="blue">
            <NotificationDropdown />
    </ToolbarButton>
    <ToolbarButton slot="end"color="blue">
        <Avatar id="avatar-menu" src="images/logo.png" />
    </ToolbarButton>
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
    <DropdownItem on:click={() => showProfileSettingsModal = true}>Inställningar</DropdownItem>
    <DropdownDivider />
    <DropdownItem on:click={async() => {await signOut()}}>Logga ut</DropdownItem>
  </Dropdown>
    <NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1"/>
  </div>

</Navbar>


