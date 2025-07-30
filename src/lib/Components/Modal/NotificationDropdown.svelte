<script lang="ts">
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getLatestNotifications } from '$lib/Managers/NotificationManager';

	// plain reactive variables
	let loading = $state(true);
	let notifications: { id: string; body: string }[] = $state([]);

	onMount(async () => {
		try {
			notifications = (await getLatestNotifications()) ?? [];
		} finally {
			loading = false;
		}
	});
</script>

<DropdownMenu.Root>
	<!-- trigger: three-dots icon -->
	<DropdownMenu.Trigger class="dots-menu inline-flex items-center justify-center rounded-full p-2 hover:bg-muted">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
			<circle cx="10" cy="3.5" r="1.5" />
			<circle cx="10" cy="10"  r="1.5" />
			<circle cx="10" cy="16.5" r="1.5" />
		</svg>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-64">
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
