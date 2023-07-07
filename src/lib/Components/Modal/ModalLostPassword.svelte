<script lang="ts">
  import { Button, Modal, Label, Input } from 'flowbite-svelte';
  import { resetPasswordForEmail } from '$lib/Managers/AuthManager';
  import { showLostPasswordModal } from '$lib/sharedStore';
  import { t } from '$lib/i18n';

  let email: string = "";
</script>

<Modal bind:open={$showLostPasswordModal} size="xs" autoclose={true} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">{$t('lost_password_reset_password')}</h3>
    <Label class="space-y-2">
      <span>{$t('lost_password_your_email')}</span>
      <Input bind:value={email} type="email" name="email" placeholder={$t('lost_password_email_placeholder')} required />
    </Label>
    <Button color="blue" on:click="{async() => {await resetPasswordForEmail(email)}}" type="submit" class="w-full">{$t('lost_password_reset_password_button')}</Button>
  </form>
</Modal>
