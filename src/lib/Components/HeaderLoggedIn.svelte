<script lang="ts">
	import { onMount } from 'svelte';
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import * as Avatar from '$lib/Components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/Components/ui/dropdown-menu/index.js';
	import { LogOut, UserCog, Coins, Settings } from '@lucide/svelte';
	import { getUserId, signOut } from '$lib/Managers/AuthManager';
	import NotificationDropdown from '$lib/Components/Modal/NotificationDropdown.svelte';
	import { showProfileSettingsModal, showServicesModal } from '$lib/sharedStore';
	import LanguageSelector from './LanguageSelector.svelte';
	import { t } from '$lib/i18n';
	import { Button } from './ui/button';
	import { addLike } from "../../db.remote"

	/* ——— state ——— */
	let id = $state('');
	let email = $state<string>('');
	let phone = $state<string>('');
	let credits = $state<number>(0);
	// let userMeta = $state<Record<string, unknown>>({});


	/* fetch user-data once */
	onMount(async () => {
		id = await getUserId();
		let user = await addLike()

		// [email, phone, credits] = await Promise.all([
		// 	trpc.email.query(id),
		// 	trpc.phone.query(id),
		// 	trpc.credits.query(id)
		// ]);
	});
</script>

<!-- ——— markup ——— -->
<Navbar class="px-0">
	<div
		class="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
	>
		<!-- brand / logo -->
		<NavBrand href="/">
			<img
				src="/images/instafication-logo-symbol-1.png"
				class="mr-3 h-6 sm:h-9"
				alt="Instafication logo"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Instafication
			</span>
		</NavBrand>

		<!-- right-hand tools -->
		<div class="flex items-center md:order-1 gap-1">
			<LanguageSelector />
			<NotificationDropdown />
			<Button
				variant="outline"
				class="hover:cursor-pointer"
				onclick={() => showServicesModal.set(true)}
			>
				<Settings />Bevakningar
			</Button>

			<!-- ⏬ NEW dropdown menu based on Avatar ⏬ -->
			<DropdownMenu.Root class="px-4">
				<DropdownMenu.Trigger class="hover:cursor-pointer">
					<Avatar.Root>
						<Avatar.Image src="https://github.com/shadcn.png" alt="Logo" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Item>
						<Coins />{$t('HEADER_LOGGEDIN_I1')}
						{credits}
					</DropdownMenu.Item>

					<DropdownMenu.Separator />

					<!-- <DropdownMenu.Item
					class="hover:cursor-pointer"
					onSelect={() => showServicesModal.set(true)}
				>
					<BellRing />{$t("HEADER_LOGGEDIN_I2")}
				</DropdownMenu.Item> -->

					<DropdownMenu.Item
						class="hover:cursor-pointer"
						onSelect={() => showProfileSettingsModal.set(true)}
					>
						<UserCog />{$t('HEADER_LOGGEDIN_I3')}
					</DropdownMenu.Item>

					<!-- <DropdownMenu.Item
						onSelect={async () => {
							const url =
								await trpc.create_customer_portal_session.query(
									email(),
								);
							goto(
								url ??
									"https://buy.stripe.com/test_cN2cQTexF9hke9W6oq",
							);
						}}
					>
						Prenumeration
					</DropdownMenu.Item> -->

					<DropdownMenu.Separator />

					<DropdownMenu.Item class="hover:cursor-pointer " onSelect={signOut}>
						<LogOut class="" />{$t('HEADER_LOGGEDIN_I4')}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</Navbar>
