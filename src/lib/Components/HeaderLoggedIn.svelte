<script lang="ts">
	/* ——— imports ——— */
	import { onMount } from "svelte";
	import { Navbar, NavBrand, Toolbar } from "flowbite-svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

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

	/* ——— state ——— */
	const uid = $state<string>("");
	const email = $state<string>("");
	const phone = $state<string>("");
	const credits = $state<number>(0);
	const userMeta = $state<Record<string, unknown>>({});

	/* derived avatar URL */
	// const avatarUrl = $derived(() =>
	// 	userMeta()?.avatar_url ?? '/images/logo.png'
	// );

	/* fetch user-data once */
	onMount(async () => {
		const id = await getUserId();
		if (!id) return;

		uid(id);

		const [e, p, c, meta] = await Promise.all([
			trpc.email.query(id),
			trpc.phone.query(id),
			trpc.credits.query(id),
		]);

		console.log(e, p, c, meta);

		email(e);
		phone(p);
		credits(c);
		userMeta(meta);
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
	<div class="flex items-center md:order-1">
		<Toolbar>
			<NotificationDropdown />

			<!-- ⏬ NEW dropdown menu based on Avatar ⏬ -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<Avatar.Image
							src="https://github.com/shadcn.png"
							alt="Logo"
						/>
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label class="px-3 py-2 text-sm font-medium">
						{$t("HEADER_LOGGEDIN_I1")} test
					</DropdownMenu.Label>

					<DropdownMenu.Separator />

					<DropdownMenu.Item
						onSelect={() => showServicesModal.set(true)}
					>
						{$t("HEADER_LOGGEDIN_I2")}
					</DropdownMenu.Item>

					<DropdownMenu.Item
						onSelect={() => showProfileSettingsModal.set(true)}
					>
						{$t("HEADER_LOGGEDIN_I3")}
					</DropdownMenu.Item>

					<DropdownMenu.Item
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
					</DropdownMenu.Item>

					<DropdownMenu.Separator />

					<DropdownMenu.Item class="text-red-600" onSelect={signOut}>
						{$t("HEADER_LOGGEDIN_I4")}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<LanguageSelector />
		</Toolbar>
	</div>
</Navbar>
