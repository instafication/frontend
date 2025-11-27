<script lang="ts">
import { getUserId } from '$lib/Managers/AuthManager';
import { onMount } from 'svelte';
import { profile_EnsureExistsByUserId, profile_GetCreditsByUserId } from '../../routes/db.remote';

let id = $state('');
let credits = $state<number>(0);

onMount(async () => {
	id = await getUserId();
	// Optimistic default while ensuring profile exists
	credits = 3;
	if (id) {
		await profile_EnsureExistsByUserId(id);
		credits = await profile_GetCreditsByUserId(id);
	}
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
		<NavBrand href="/">
			<img
				src="/images/instafication-logo-symbol-1.avif"
				class="mr-3 h-6 sm:h-9"
				alt="Instafication logo"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Instafication
			</span>
		</NavBrand>

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

			<DropdownMenu.Root class="px-4">
				<DropdownMenu.Trigger class="hover:cursor-pointer">
					<Avatar.Root>
						<Avatar.Image src="./images/profile.avif" alt="Profile Logo" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Item>
						<Coins />{$t('HEADER_LOGGEDIN_I1')}
						{credits}
					</DropdownMenu.Item>

					<DropdownMenu.Separator />
					<DropdownMenu.Item
						class="hover:cursor-pointer"
						onSelect={() => showProfileSettingsModal.set(true)}
					>
						<UserCog />{$t('HEADER_LOGGEDIN_I3')}
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="hover:cursor-pointer " onSelect={signOut}>
						<LogOut class="" />{$t('HEADER_LOGGEDIN_I4')}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</Navbar>
