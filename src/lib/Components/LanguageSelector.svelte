<script lang="ts">
import { Se, Us } from 'svelte-flag-icons';
import { Button } from '$lib/components/ui/button';
import { selectedLanguage } from '$lib/sharedStore';
</script>

{#if $selectedLanguage == 'sv'}
	<Button
		variant="outline"
		onclick={() => ($selectedLanguage = 'en')}
		color="alternative"
		class="p-2 cursor-pointer"
	>
		<Se size="24" />
	</Button>
{:else}
	<Button
		variant="outline"
		onclick={() => ($selectedLanguage = 'sv')}
		color="alternative"
		class="p-2 cursor-pointer"
	>
		<Us size="24" />
	</Button>
{/if}
