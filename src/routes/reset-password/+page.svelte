<script lang="ts">
	import authClient from '$lib/authClient';
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/Components/ui/dialog/index.js';
	import { Button } from '$lib/Components/ui/button/index.js';

	let newPassword = $state<string>('');
	let isLoading = $state<boolean>(false);
	let token = $state<string | null>(null);
	let open = $state<boolean>(true);

	onMount(() => {
		const params = new URLSearchParams(location.search);
		token = params.get('token') ?? null;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!token) {
			alert('Ogiltig återställningslänk');
			return;
		}
		isLoading = true;
		try {
			await (authClient as any).resetPassword?.({ newPassword, token });
			alert('Lösenordet är ändrat. Logga in igen.');
			location.assign('/');
		} catch (err) {
			console.error('Reset password error', err);
			alert('Kunde inte återställa lösenordet');
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full max-w-xs">
		<Dialog.Header>
			<Dialog.Title>Återställ lösenord</Dialog.Title>
		</Dialog.Header>

		<form class="flex flex-col space-y-6" onsubmit={handleSubmit}>
			<label class="space-y-2">
				<span>Nytt lösenord</span>
				<input
					class="w-full rounded-md border p-2"
					type="password"
					bind:value={newPassword}
					name="password"
					placeholder="••••••"
					required
				/>
			</label>

			{#if !token}
				<p class="text-sm text-gray-500">
					Ogiltig eller saknad token. Kontrollera länken i din e‑post.
				</p>
			{/if}

			<Dialog.Footer>
				<Button type="submit" variant="outline" class="w-full" disabled={isLoading}>
					{#if isLoading}
						Bearbetar...
					{:else}
						Återställ lösenord
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
