<script lang="ts">
import * as authManager from '$lib/Managers/AuthManager';
import { showProfileSettingsModal } from '$lib/sharedStore';
import { onMount } from 'svelte';

let email = $state<string>('');
let _loading = $state<boolean>(false);

const _handleSave = async (e: Event) => {
	e.preventDefault();
	_loading = true;
	const ok = await authManager.updateEmail(email);
	_loading = false;
	if (ok) showProfileSettingsModal.set(false);
};

async function loadUserData() {
	email = await authManager.getUserEmail();
}

onMount(loadUserData);
</script>

<Dialog.Root bind:open={$showProfileSettingsModal}>
	<Dialog.Trigger class="hidden" />
	<Dialog.Content class="w-full max-w-xs">
		<Dialog.Header>
			<Dialog.Title>{$t('profile_settings')}</Dialog.Title>
		</Dialog.Header>
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

			<Dialog.Footer>
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
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
