<script lang="ts">
import { Loader2, LogIn } from '@lucide/svelte';
import { Input, Label } from 'flowbite-svelte';
import Checkbox from '$lib/Components/Custom/Checkbox.svelte';
import { Button } from '$lib/Components/ui/button';
import {
	Dialog,
	Content as DialogContent,
	Header as DialogHeader,
	Title as DialogTitle
} from '$lib/Components/ui/dialog';
/* auth + stores */
import { t } from '$lib/i18n';
import { signInWithOAuth, signInWithPassword } from '$lib/Managers/AuthManager';
import { showLoginModal, showLostPasswordModal, showRegisterModal } from '$lib/sharedStore';

/* ───────── reactive state ───────── */
let email = $state('');
let password = $state('');
let loading = $state(false);

/* ───────── actions ───────── */
const handlePasswordLogin = async (e?: Event) => {
	e?.preventDefault?.();
	if (loading) return;
	loading = true;
	try {
		const success = await signInWithPassword(email, password);
		if (success) {
			$showLoginModal = false;
		}
	} finally {
		loading = false;
	}
};

const handleGoogleLogin = async () => {
	if (loading) return;
	loading = true;
	try {
		await signInWithOAuth();
	} finally {
		loading = false;
	}
};

function openLostPassword() {
	$showLostPasswordModal = true;
	$showLoginModal = false;
}

function openRegister() {
	$showRegisterModal = true;
	$showLoginModal = false;
}
</script>

<Dialog.Root
	bind:open={$showLoginModal}
	onOpenChange={(open) => console.log('Login modal open:', open)}
>
	<!-- Optional trigger elsewhere; Dialog.Trigger omitted here -->

	<DialogContent class="w-full max-w-md">
		<DialogHeader>
			<DialogTitle>{$t('log_in_to_your_profile')}</DialogTitle>
		</DialogHeader>

		<!-- onsubmit prevents page reload via preventDefault in handler -->
		<form
			class="flex flex-col space-y-6"
			onsubmit={(e) => {
				e.preventDefault();
				handlePasswordLogin();
			}}
		>
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

			<div class="flex items-start">
				<Checkbox class="hover:cursor-pointer" value="remember">
					{$t('remember_me')}
				</Checkbox>
				<button
					tabindex="-1"
					class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500 hover:cursor-pointer"
					onclick={openLostPassword}
					type="button"
				>
					{$t('lost_password')}
				</button>
			</div>

			<Button
				color="blue"
				type="submit"
				class="w-full inline-flex items-center justify-center gap-2 hover:cursor-pointer"
				disabled={loading}
			>
				{#if loading}
					<Loader2 class="w-4 h-4 animate-spin" />
				{:else}
					<LogIn class="w-4 h-4" />
				{/if}
				<span>{$t('log_in_button')}</span>
			</Button>
			
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				{$t('not_registered')}
				<button
					class="text-blue-700 hover:underline dark:text-blue-500 hover:cursor-pointer"
					onclick={openRegister}
					type="button"
				>
					{$t('create_an_account')}
				</button>
			</div>
		</form>
	</DialogContent>
</Dialog.Root>
