<script lang="ts">
	
  import {getLatestNotifications } from '$lib/Managers/NotificationManager';
  import {Dropdown, DropdownItem, Button } from 'flowbite-svelte'

</script>

<!-- <MenuButton class="dots-menu dark:text-white" vertical /> -->
<Dropdown triggeredBy=".dots-menu">

    {#await getLatestNotifications() then notifications}
      {#each notifications as notification}
        <DropdownItem>
          {notification.body}
        </DropdownItem>
      {/each}
    {/await}

</Dropdown>