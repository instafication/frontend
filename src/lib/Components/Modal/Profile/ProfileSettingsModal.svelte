<script lang="ts">
  import { Button, Modal, Label, Input } from 'flowbite-svelte';
  import { getUserId } from '$lib/Managers/AuthManager';
  import { onMount } from 'svelte';
  import { updateProfileById } from '$lib/Managers/ProfileManager';
  import { trpc } from '$lib/trpc/client';
  import { showProfileSettingsModal } from '$lib/sharedStore';
  import { t } from "$lib/i18n";

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
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">{$t("profile_settings")}</h3>
    <Label class="space-y-2">
      <span>{$t("profile_your_email")}</span>
      <Input bind:value={email} type="email" name="email" placeholder={$t("profile_email_placeholder")} required />
    </Label>
    <Label class="space-y-2">
      <span>{$t("profile_your_phone_number")}</span>
      <Input bind:value={phone} type="tel" name="phoneNumber" placeholder="+46707749377" required />
    </Label>
    <Button on:click="{async() => {await updateProfileById(id, email, phone)}}" type="submit" class="w-full1">{$t("profile_save_changes")}</Button>
  </form>
</Modal>
