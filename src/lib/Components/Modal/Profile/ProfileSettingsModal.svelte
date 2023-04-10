<script lang="ts">
  import { Button, Modal, Label, Input } from 'flowbite-svelte';
  import { getUserId } from '$lib/Managers/AuthManager';
  import { onMount } from 'svelte';
  import { updateProfileById } from '$lib/Managers/ProfileManager';
  import { trpc } from '$lib/trpc/client';
  import { showProfileSettingsModal } from '$lib/sharedStore';

  let id: string = "";
  let email: string = "";
  let phone: string = "";
  async function parseUserData() {
    id = await getUserId();    
    email = await trpc.email.query(id);
    phone = await trpc.phone.query(id);
  }
  onMount(async () => {
    parseUserData();
  })


</script>

<Modal bind:open={$showProfileSettingsModal} size="xs" autoclose={true} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Inställningar</h3>
    <Label class="space-y-2">
      <span>Din email</span>
      <Input bind:value={email} type="email" name="email" placeholder="e.x. namn@gmail.com" required />
    </Label>
    <Label class="space-y-2">
      <span>Ditt telefonnummer</span>
      <Input bind:value={phone} type="tel" name="phoneNumber" placeholder="+46707749377" required />
    </Label>
    <Button on:click="{async() => {await updateProfileById(id, email, phone)}}" type="submit" class="w-full1">Spara ändringarna!</Button>
  </form>
</Modal>