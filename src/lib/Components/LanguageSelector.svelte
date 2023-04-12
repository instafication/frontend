<script>
    import { selectedLanguage } from '$lib/sharedStore';
    import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
    import { Us, Se } from 'svelte-flags';

    const languages = [
        {value:"sv", name: "Svenska"},
        {value:"en", name: "English"},
    ]

</script>

<div class="flex gap-4 px-2">

    <Button class="border-0 focus:ring-4 focus:outline-none focus:ring-white" color="alternative" id="trigger-button">
        {#if $selectedLanguage == "sv"}
            <Se size=32 class="px-2"/>
            Svenska
        {:else}
            <Us size=32 class="px-2"/>
            English
        {/if}

    </Button>

  <Dropdown triggeredBy="#trigger-button" class="transition duration-1050 ease-in-out">

    <DropdownItem on:click={() => $selectedLanguage = "sv"} class="flex items-center transition duration-150 ease-in-out">
      <Se size=32 class="px-2"/>
      Svenska
    </DropdownItem>

    <DropdownItem on:click={() => $selectedLanguage = "en"} class="flex items-center transition duration-150 ease-in-out">
      <Us size=32 class="px-2"/>
       English
    </DropdownItem>

  </Dropdown>

</div>