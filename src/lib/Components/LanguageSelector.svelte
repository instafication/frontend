<script lang="ts">

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
