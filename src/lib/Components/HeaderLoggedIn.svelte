<script lang="ts">
	/* ——— imports ——— */
	import { onMount } from "svelte";
	import { Navbar, NavBrand, Toolbar } from "flowbite-svelte";
	import * as Avatar from "$lib/Components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/Components/ui/dropdown-menu/index.js";
	import { LogOut, BellRing, UserCog, Coins, Settings } from "@lucide/svelte";
	import { trpc } from "$lib/trpc/client";
	import { getUserId, signOut } from "$lib/Managers/AuthManager";
	import NotificationDropdown from "$lib/Components/Modal/NotificationDropdown.svelte";
	import {
		showProfileSettingsModal,
		showServicesModal,
	} from "$lib/sharedStore";
	import LanguageSelector from "./LanguageSelector.svelte";
	import { goto } from "$app/navigation";
	import { t } from "$lib/i18n";
	import { Button } from "./ui/button";

	/* ——— state ——— */
	let id = $state("");
	let email = $state<string>("");
	let phone = $state<string>("");
	let credits = $state<number>(0);
	// let userMeta = $state<Record<string, unknown>>({});

	/* fetch user-data once */
	onMount(async () => {
		id = await getUserId();
		[email, phone, credits] = await Promise.all([
			trpc.email.query(id),
			trpc.phone.query(id),
			trpc.credits.query(id),
		]);
	});
</script>

<!-- ——— markup ——— -->
<Navbar>
	<!-- brand / logo -->
	<NavBrand href="/">
		<img
			src="/images/logo.png"
			class="mr-3 h-6 sm:h-9"
			alt="Instafication logo"
		/>
		<span
			class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
		>
			Instafication
		</span>
	</NavBrand>

	<!-- right-hand tools -->
	<div class="flex items-center md:order-1 gap-1">
		<LanguageSelector />
		<NotificationDropdown />
		<Button variant="outline" class="hover:cursor-pointer" on:click={() => showServicesModal.set(true)}>
			<BellRing />Alarm
		</Button>

		<!-- ⏬ NEW dropdown menu based on Avatar ⏬ -->
		<DropdownMenu.Root class="px-4">
			<DropdownMenu.Trigger class="hover:cursor-pointer">
				<Avatar.Root>
					<Avatar.Image
						src="https://github.com/shadcn.png"
						alt="Logo"
					/>
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Item>
					<Coins />{$t("HEADER_LOGGEDIN_I1")}
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
					<UserCog />{$t("HEADER_LOGGEDIN_I3")}
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

				<DropdownMenu.Item
					class="hover:cursor-pointer "
					onSelect={signOut}
				>
					<LogOut class="" />{$t("HEADER_LOGGEDIN_I4")}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Navbar>
