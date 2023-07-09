<script>
    import { selectedLanguage } from '$lib/sharedStore';
    import { Dropdown, DropdownItem,Button, Chevron } from 'flowbite-svelte'
    import { Us, Se } from 'svelte-flags';

    const languages = [
        {value:"sv", name: "Svenska"},
        {value:"en", name: "English"},
    ]

</script>


<!-- <div class="flex gap-4 px-0"></div> -->
<div class="flex gap-4 px-0">
    <!-- <Button id="trigger-button" color="alternative" class="border-0 focus:ring-0 focus:outline-none focus:ring-white"></Button> -->

        {#if $selectedLanguage == "sv"}
            <Button on:click={() => $selectedLanguage = "en"} color="alternative">
              <Us size=32 class="px-2"/>
              English
            </Button>
        {:else}
            <Button on:click={() => $selectedLanguage = "sv"} color="alternative">
              <Se size=32 class="px-2"/>
              Swedish
            </Button>
        {/if}
<!-- <Dropdown triggeredBy="#trigger-button" class="transition duration-0 ease-in-out" -->
  <!-- <Dropdown triggeredBy="#trigger-button">
    <DropdownItem>a</DropdownItem>

    <DropdownItem on:click={() => alert("OK")} class="flex items-center transition duration-150 ease-in-out">
      <Se size=32 class="px-2"/>
      Svenska
    </DropdownItem>

    <DropdownItem on:click={() => $selectedLanguage = "en"} class="flex items-center transition duration-150 ease-in-out">
      <Us size=32 class="px-2"/>
       English
    </DropdownItem>

  </Dropdown> -->

</div>