<script lang="ts">
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import {
		Navbar,
		NavBrand,
		Toolbar,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';

	import { getUserId, signOut } from '$lib/Managers/AuthManager';
	import NotificationDropdown from '$lib/Components/Modal/NotificationDropdown.svelte';
	import { showServicesModal, showProfileSettingsModal } from '$lib/sharedStore';
	import LanguageSelector from './LanguageSelector.svelte';
	import { t } from '$lib/i18n';
	import { goto } from '$app/navigation';

	// ▸ reactive state ---------------------------------------------------------
	let userId          = $state<string>('');
	let email           = $state<string>('');
	let phone           = $state<string>('');
	let credits         = $state<number>(0);
	let rawUserMetaData = $state<Record<string, unknown>>({});

	async function parseUserData() {
		userId          = await getUserId();
		email           = await trpc.email.query(userId);
		phone           = await trpc.phone.query(userId);
		credits         = await trpc.credits.query(userId);
		rawUserMetaData = await trpc.raw_user_meta_data.query(userId);
	}

	onMount(parseUserData);          // runs once after mount
</script>

<!-- ----------------------------------------------------------------------- -->

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img src="/images/logo.png" class="mr-3 h-6 sm:h-9" alt="Instafication logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Instafication
		</span>
	</NavBrand>

	<div class="flex items-center md:order-1">
		<Toolbar>
			<NotificationDropdown />
			<Avatar
				id="avatar-menu"
				src={rawUserMetaData.avatar_url ?? '/images/logo.png'}
			/>
			<LanguageSelector />
		</Toolbar>

		<Dropdown placement="button" class="rounded-lg" triggeredBy="#avatar-menu">
			<DropdownHeader class="flex">
				<span class="flex text-sm flex-1">
					{t('HEADER_LOGGEDIN_I1')} {credits}
				</span>
			</DropdownHeader>

			<!-- your own click handler -->
			<DropdownItem onclick={() => alert('OK')}>
				{t('HEADER_LOGGEDIN_I2')}
			</DropdownItem>

			<!-- toggling a Svelte store -->
			<DropdownItem onclick={() => ($showProfileSettingsModal = true)}>
				{t('HEADER_LOGGEDIN_I3')}
			</DropdownItem>

			<!-- async navigation -->
			<DropdownItem
				onclick={async () => {
					const url = await trpc.create_customer_portal_session.query(email);
					goto(url || 'https://buy.stripe.com/test_cN2cQTexF9hke9W6oq');
				}}
			>
				Prenumeration
			</DropdownItem>

			<DropdownDivider />

			<DropdownItem onclick={async () => signOut()}>
				{t('HEADER_LOGGEDIN_I4')}
			</DropdownItem>
		</Dropdown>
	</div>
</Navbar>
