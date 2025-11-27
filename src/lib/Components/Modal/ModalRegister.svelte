<script lang="ts">
import { signUp } from '$lib/Managers/AuthManager';
import { toast } from 'svelte-sonner';

/* ───────── reactive state ───────── */
const email = $state('');
const password = $state('');
let loading = $state(false);

/* ───────── helpers ───────── */
const register = async (e?: Event) => {
	e?.preventDefault?.();
	if (loading) return;
	loading = true;
	try {
		const ok = await signUp(email, password);
		if (ok) {
			$showRegisterModal = false;
		}
	} catch {
		toast.error("Error, can't create account. Try again.");
	} finally {
		loading = false;
	}
};
</script>

<Dialog.Root bind:open={$showRegisterModal}>
	<!-- Optional trigger can be placed elsewhere -->
	<Dialog.Content class="w-full max-w-xs">
		<Dialog.Header>
			<Dialog.Title>{$t('register_new_account_title')}</Dialog.Title>
		</Dialog.Header>

		<!-- prevent reload in handler -->
		<form class="flex flex-col space-y-6" onsubmit={register}>
			<Label class="space-y-2">
				<span>{$t('your_email')}</span>
				<Input
					bind:value={email}
					type="email"
					name="email"
					placeholder={$t('email_placeholder')}
					required
				/>
			</Label>

			<Label class="space-y-2">
				<span>{$t('your_password')}</span>
				<Input
					bind:value={password}
					type="password"
					name="password"
					placeholder={$t('password_placeholder')}
					required
				/>
			</Label>

			<Button
				type="submit"
				color="blue"
				class="w-full inline-flex items-center justify-center gap-2 cursor-pointer"
				disabled={loading}
			>
				{#if loading}
					<Loader2 class="w-4 h-4 animate-spin" />
				{:else}
					<UserRoundPlus class="w-4 h-4" />
				{/if}
				<span>{$t('register_your_account')}</span>
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
