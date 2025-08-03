<script lang="ts">
	import * as Dialog from '$lib/Components/ui/dialog/index.js';
	import { Label, Input } from 'flowbite-svelte';
	import { Button } from '$lib/Components/ui/button/index.js';
	import { Save, Loader2 } from '@lucide/svelte';
	import { getUserId } from '$lib/Managers/AuthManager';
	import * as authManager from '$lib/Managers/AuthManager';
	import { showProfileSettingsModal } from '$lib/sharedStore';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';

	let email = $state('');
	let loading = $state(false);

	async function loadUserData() {
		email = await authManager.getUserEmail();
	}

	onMount(loadUserData);

	const handleSave = async () => {
		loading = true;
		await authManager.updateEmail(email);
		loading = false;
		showProfileSettingsModal.set(false);
	};
</script>

<!-- Dialog ----------------------------------------------------------- -->
<Dialog.Root bind:open={$showProfileSettingsModal}>
	<!-- optional invisible trigger if you ever need imperative open() -->
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
