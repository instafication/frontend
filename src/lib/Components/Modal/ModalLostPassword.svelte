<script lang="ts">
import { resetPasswordForEmail } from '$lib/Managers/AuthManager';

const email = $state('');
let _isLoading = $state(false);

const _handleReset = async (e: Event) => {
	e.preventDefault();
	_isLoading = true;
	await resetPasswordForEmail(email);
	_isLoading = false;
};
</script>

<Dialog.Root bind:open={$showLostPasswordModal}>
	<Dialog.Content class="w-full max-w-xs">
		<Dialog.Header>
			<Dialog.Title>{$t('lost_password_reset_password')}</Dialog.Title>
		</Dialog.Header>

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
	</Dialog.Content>
</Dialog.Root>
