<script lang="ts">
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getLatestNotifications } from '$lib/Managers/NotificationManager';
	import { BellRing } from "@lucide/svelte";
	import { Button } from "$lib/Components/ui/button/index.js";

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
