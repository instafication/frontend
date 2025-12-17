<script lang="ts">
import { Coins, LogOut, Settings, UserCog } from '@lucide/svelte';
import { NavBrand, Navbar } from 'flowbite-svelte';
import { onMount } from 'svelte';
import LanguageSelector from '$lib/components/LanguageSelector.svelte';
import NotificationDropdown from '$lib/components/Modal/NotificationDropdown.svelte';
import {
	Fallback as AvatarFallback,
	Image as AvatarImage,
	Root as AvatarRoot
} from '$lib/components/ui/avatar';
import { Button } from '$lib/components/ui/button';
import {
	DropdownMenu,
	Content as DropdownMenuContent,
	Item as DropdownMenuItem,
	Separator as DropdownMenuSeparator,
	Trigger as DropdownMenuTrigger
} from '$lib/components/ui/dropdown-menu';
import { t } from '$lib/i18n';
import { getUserId, signOut } from '$lib/managers/AuthManager';
import { showProfileSettingsModal, showServicesModal } from '$lib/sharedStore';
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
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white hidden sm:inline">
				Instafication
			</span>
		</NavBrand>

		<div class="flex items-center md:order-1 gap-1 sm:gap-2">
			<LanguageSelector />
			<NotificationDropdown />
			<Button
				variant="outline"
				class="hover:cursor-pointer px-2 sm:px-4"
				onclick={() => showServicesModal.set(true)}
			>
				<Settings class="h-4 w-4" />
				<span class="hidden sm:inline ml-1">Bevakningar</span>
			</Button>

		<DropdownMenu.Root>
			<DropdownMenuTrigger class="hover:cursor-pointer">
				<AvatarRoot>
					<AvatarImage src="./images/profile.avif" alt="Profile Logo" />
					<AvatarFallback>CN</AvatarFallback>
				</AvatarRoot>
			</DropdownMenuTrigger>

			<DropdownMenuContent class="w-56">
				<DropdownMenuItem>
					<Coins />{$t('HEADER_LOGGEDIN_I1')}
					{credits}
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuItem
					class="hover:cursor-pointer"
					onSelect={() => showProfileSettingsModal.set(true)}
				>
					<UserCog />{$t('HEADER_LOGGEDIN_I3')}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem class="hover:cursor-pointer " onSelect={signOut}>
					<LogOut class="" />{$t('HEADER_LOGGEDIN_I4')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu.Root>
		</div>
	</div>
</Navbar>
