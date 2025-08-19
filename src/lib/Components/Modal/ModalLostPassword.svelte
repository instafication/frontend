<script lang="ts">
	import * as Dialog from '$lib/Components/ui/dialog/index.js';
	import { resetPasswordForEmail } from '$lib/Managers/AuthManager';
	import { showLostPasswordModal } from '$lib/sharedStore';
	import { t } from '$lib/i18n';

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
	<Dialog.Content class="w-full max-w-xs">
		<Dialog.Header>
			<Dialog.Title>{$t('lost_password_reset_password')}</Dialog.Title>
		</Dialog.Header>

		<form class="flex flex-col space-y-6" onsubmit={handleReset}>
			<label class="space-y-2">
				<span>{$t('lost_password_your_email')}</span>
				<input
					bind:value={email}
					type="email"
					name="email"
					placeholder={$t('lost_password_email_placeholder')}
					required
				/>
			</label>

			<button type="submit" class="w-full" disabled={isLoading}>
				{$t('lost_password_reset_password_button')}
			</button>
		</form>
	</Dialog.Content>
</Dialog.Root>
