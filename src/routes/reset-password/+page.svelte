<script lang="ts">
import { onMount } from 'svelte';
import authClient from '$lib/authClient';
import { Button } from '$lib/components/ui/button';
import {
	Dialog,
	Content as DialogContent,
	Footer as DialogFooter,
	Header as DialogHeader,
	Title as DialogTitle
} from '$lib/components/ui/dialog';

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
		await (
			authClient as unknown as {
				resetPassword?: (opts: { newPassword: string; token: string }) => Promise<void>;
			}
		).resetPassword?.({ newPassword, token });
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
	<DialogContent class="w-full max-w-xs">
		<DialogHeader>
			<DialogTitle>Återställ lösenord</DialogTitle>
		</DialogHeader>

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

			<DialogFooter>
				<Button type="submit" variant="outline" class="w-full" disabled={isLoading}>
					{#if isLoading}
						Bearbetar...
					{:else}
						Återställ lösenord
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog.Root>
