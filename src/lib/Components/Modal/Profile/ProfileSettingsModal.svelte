<script lang="ts">
import { Loader2, Save } from '@lucide/svelte';
import { Input, Label } from 'flowbite-svelte';
import { onMount } from 'svelte';
import { Button } from '$lib/Components/ui/button';
import {
	Dialog,
	Trigger as DialogTrigger,
	Content as DialogContent,
	Header as DialogHeader,
	Title as DialogTitle,
	Footer as DialogFooter
} from '$lib/Components/ui/dialog';
import { t } from '$lib/i18n';
import * as authManager from '$lib/Managers/AuthManager';
import { showProfileSettingsModal } from '$lib/sharedStore';

let email = $state<string>('');
let loading = $state<boolean>(false);

const handleSave = async (e: Event) => {
	e.preventDefault();
	loading = true;
	const ok = await authManager.updateEmail(email);
	loading = false;
	if (ok) showProfileSettingsModal.set(false);
};

async function loadUserData() {
	email = await authManager.getUserEmail();
}

onMount(loadUserData);
</script>

<Dialog.Root bind:open={$showProfileSettingsModal}>
	<DialogTrigger class="hidden" />
	<DialogContent class="w-full max-w-xs">
		<DialogHeader>
			<DialogTitle>{$t('profile_settings')}</DialogTitle>
		</DialogHeader>
		<form class="flex flex-col space-y-6" onsubmit={handleSave}>
			<Label class="space-y-2">
				<span>{$t('profile_your_email')}</span>
				<Input
					bind:value={email}
					type="email"
					name="email"
					placeholder={$t('profile_email_placeholder')}
					required
				/>
			</Label>

			<DialogFooter>
				<Button
					variant="outline"
					type="submit"
					class="hover:cursor-pointer w-full"
					disabled={loading}
				>
					{#if loading}
						<Loader2 class="animate-spin" />
					{:else}
						<Save />
					{/if}
					{$t('profile_save_changes')}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog.Root>
