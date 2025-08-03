<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { notification_GetLatest } from '../../../routes/db.remote';
	import { BellRing } from '@lucide/svelte';
	import { Button } from '$lib/Components/ui/button/index.js';

	// let loading = $state<boolean>(true);
	// let notifications = $state([]);
	// onMount(async () => {
	// 	try {
	// 		notifications = await notification_getLatest(3);
	// 	} finally {
	// 		loading = false;
	// 	}
	// });
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline" class="hover:cursor-pointer">
			<BellRing />Notifikationer
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<!-- {#if loading}
			<DropdownMenu.Item disabled>Loading …</DropdownMenu.Item>
		{:else if notifications.length === 0}
			<DropdownMenu.Item disabled>No notifications</DropdownMenu.Item>
		{:else} -->
		<svelte:boundary>
			{#each await notification_GetLatest(3) as notification}
				<DropdownMenu.Item class="whitespace-normal">
					{notification.body}
				</DropdownMenu.Item>
			{/each}
			{#snippet pending()}
				<p>Loading...</p>
			{/snippet}
		</svelte:boundary>
	</DropdownMenu.Content>
</DropdownMenu.Root>
