<script lang="ts">
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { notification_getLatest } from '../../../routes/db.remote';
	import { BellRing } from '@lucide/svelte';
	import { Button } from '$lib/Components/ui/button/index.js';

	let loading = $state(true);
	let notifications = $state([]);

	onMount(async () => {
		try {
			notifications = await notification_getLatest(3);
		} finally {
			loading = false;
		}
	});
</script>

<DropdownMenu.Root>
	<!-- trigger: bell icon -->
	<DropdownMenu.Trigger>
		<Button variant="outline" class="hover:cursor-pointer">
			<BellRing />Notifikationer
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		{#if loading}
			<DropdownMenu.Item disabled>Loading …</DropdownMenu.Item>
		{:else if notifications.length === 0}
			<DropdownMenu.Item disabled>No notifications</DropdownMenu.Item>
		{:else}
			{#each notifications as n}
				<DropdownMenu.Item class="whitespace-normal">
					{n.body}
				</DropdownMenu.Item>
			{/each}
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
