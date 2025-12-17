<script lang="ts">
import { BellRing } from '@lucide/svelte';
import { Button } from '$lib/components/ui/button';
import {
	DropdownMenu,
	Content as DropdownMenuContent,
	Item as DropdownMenuItem,
	Trigger as DropdownMenuTrigger
} from '$lib/components/ui/dropdown-menu';
import { notification_GetLatest } from '../../../routes/db.remote';
</script>

<DropdownMenu.Root>
	<DropdownMenuTrigger>
		<Button variant="outline" class="hover:cursor-pointer">
			<BellRing />Notifikationer
		</Button>
	</DropdownMenuTrigger>

	<DropdownMenuContent>
		<svelte:boundary>
			{#each await notification_GetLatest(3) as notification}
				<DropdownMenuItem class="whitespace-normal">
					{notification.body}
				</DropdownMenuItem>
			{/each}
			{#snippet pending()}
				<p>Loading...</p>
			{/snippet}
		</svelte:boundary>
	</DropdownMenuContent>
</DropdownMenu.Root>
