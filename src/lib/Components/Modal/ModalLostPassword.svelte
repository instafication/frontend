<script lang="ts">
import { Loader2, RotateCcwKey } from '@lucide/svelte';
import { Input, Label } from 'flowbite-svelte';
import { Button } from '$lib/Components/ui/button';
import {
	Dialog,
	Content as DialogContent,
	Header as DialogHeader,
	Title as DialogTitle
} from '$lib/Components/ui/dialog';
import { t } from '$lib/i18n';
import { resetPasswordForEmail } from '$lib/Managers/AuthManager';
import { showLostPasswordModal } from '$lib/sharedStore';

let email = $state('');
let isLoading = $state(false);

const handleReset = async (e: Event) => {
	e.preventDefault();
	isLoading = true;
	await resetPasswordForEmail(email);
	isLoading = false;
};
</script>

<Dialog.Root bind:open={$showLostPasswordModal}>
	<DialogContent class="w-full max-w-xs">
		<DialogHeader>
			<DialogTitle>{$t('lost_password_reset_password')}</DialogTitle>
		</DialogHeader>

		<form class="flex flex-col space-y-6" onsubmit={handleReset}>
			<Label class="space-y-2">
				<span>{$t('lost_password_your_email')}</span>
				<Input
					bind:value={email}
					type="email"
					name="email"
					placeholder={$t('lost_password_email_placeholder')}
					required
				/>
			</Label>

			<Button type="submit" color="blue" class="w-full" disabled={isLoading}>
				{#if isLoading}
					<Loader2 class="w-4 h-4 animate-spin mr-2" />
				{:else}
					<RotateCcwKey class="w-4 h-4 mr-2" />
				{/if}
				{$t('lost_password_reset_password_button')}
			</Button>
		</form>
	</DialogContent>
</Dialog.Root>
