<script lang="ts">
    import { selectedLanguage } from '$lib/sharedStore';
    import { Button } from 'flowbite-svelte'
    import { Us, Se } from 'svelte-flags';

    const languages = [
        {value:"sv", name: "Svenska"},
        {value:"en", name: "English"},
    ]
</script>


<!-- <div class="flex gap-4 px-0"></div> -->
<div class="flex items-center">
    {#if $selectedLanguage == "sv"}
        <Button onclick={() => $selectedLanguage = "en"} color="alternative" class="p-2">
          <Us size=24/>
        </Button>
    {:else}
        <Button onclick={() => $selectedLanguage = "sv"} color="alternative" class="p-2">
          <Se size=24/>
        </Button>
    {/if}
</div>
<!-- <Dropdown triggeredBy="#trigger-button" class="transition duration-0 ease-in-out" -->
  <!-- <Dropdown triggeredBy="#trigger-button">
    <DropdownItem>a</DropdownItem>

    <DropdownItem onclick={() => alert("OK")} class="flex items-center transition duration-150 ease-in-out">
      <Se size=32 class="px-2"/>
      Svenska
    </DropdownItem>

    <DropdownItem onclick={() => $selectedLanguage = "en"} class="flex items-center transition duration-150 ease-in-out">
      <Us size=32 class="px-2"/>
       English
    </DropdownItem>

  </Dropdown> -->
 