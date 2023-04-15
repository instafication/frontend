<script lang="ts">

    import { trpc } from '$lib/trpc/client';
    import { onMount } from 'svelte';
    import { Navbar,  NavBrand,  Toolbar, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider, ButtonGroup, Button } from 'flowbite-svelte'
    import { getUserId, signOut, supabase } from '$lib/Managers/AuthManager';
    import NotificationDropdown from '$lib/Components/Modal/NotificationDropdown.svelte';
    import { showServicesModal, showProfileSettingsModal } from "$lib/sharedStore";
    import LanguageSelector from './LanguageSelector.svelte';
    import { t } from '$lib/i18n';
    import { redirect } from '@sveltejs/kit';
    import { goto } from '$app/navigation';

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

        // console.log("[layout.svelte] User ID: " + userId);
        // console.log("[layout.svelte] User email: " + email);
        // console.log("[layout.svelte] User phone: " + phone);
        // console.log("[layout.svelte] User credits: " + credits);

        rawUserMetaData = await trpc.raw_user_meta_data.query(userId);
        console.log(rawUserMetaData);

    }
    onMount(async () => {
        parseUserData();
    })

</script>


<Navbar let:hidden let:toggle>

    <NavBrand href="/">
        <img src="/images/logo.png" class="mr-3 h-6 sm:h-9" alt="BlinkSMS Logo"/>
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BlinkSMS</span>
    </NavBrand>


    <div class="flex items-center md:order-1">

        <Toolbar >
            <NotificationDropdown />
            <Avatar id="avatar-menu" src="{rawUserMetaData.avatar_url || '/images/logo.png'}" />
            <LanguageSelector/>
        </Toolbar>

        <Dropdown class="rounded-lg" placement="bottom" triggeredBy="#avatar-menu">

            <DropdownHeader class="flex">

                <!-- <span class="block text-sm">
                    <lord-icon src="https://cdn.lordicon.com/qhviklyi.json" trigger="hover" style="width:32px;height:32px"></lord-icon>
                    {email}
                </span> -->
    
                <span class="flex text-sm">
                    <!-- <lord-icon class="flex-1" src="https://cdn.lordicon.com/qhviklyi.json" trigger="hover" style="width:32px;height:32px"></lord-icon> -->
                    <div class="flex-1">
                        {$t("HEADER_LOGGEDIN_I1")}
                        {credits}
                    </div>
                </span>

            </DropdownHeader>

            <DropdownItem on:click={() => $showServicesModal = true}>{$t("HEADER_LOGGEDIN_I2")}</DropdownItem>
            <DropdownItem on:click={() => $showProfileSettingsModal = true}>{$t("HEADER_LOGGEDIN_I3")}</DropdownItem>
            <DropdownItem on:click={async() => {
                const url = await trpc.create_customer_portal_session.query(email);

                if (url === "") {
                    goto("https://buy.stripe.com/test_cN2cQTexF9hke9W6oq");
                } else {
                    goto(url);
                }

            }}>Prenumeration</DropdownItem>
            <DropdownDivider />
            <DropdownItem on:click={async() => {await signOut()}}>{$t("HEADER_LOGGEDIN_I4")}</DropdownItem>
        </Dropdown>

    </div>

</Navbar>