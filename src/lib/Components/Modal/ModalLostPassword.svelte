<script lang="ts">
  /* UI kit */
  import { Button, Modal, Label, Input } from 'flowbite-svelte';

  /* managers & stores */
  import { resetPasswordForEmail } from '$lib/Managers/AuthManager';
  import { showLostPasswordModal } from '$lib/sharedStore';

  /* i18n */
  import { t } from '$lib/i18n';

  /* ───────── reactive state ───────── */
  let email = $state('');

  /* ───────── actions ───────── */
  const handleReset = async () => {
    await resetPasswordForEmail(email);
  };
</script>

<Modal bind:open={$showLostPasswordModal}
       size="xs"
       placement="center"
       autoclose>

  <form class="flex flex-col space-y-6"
        onsubmit={handleReset}>

    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      {$t('lost_password_reset_password')}
    </h3>

    <Label class="space-y-2">
      <span>{$t('lost_password_your_email')}</span>
      <Input bind:value={email}
             type="email"
             name="email"
             placeholder={$t('lost_password_email_placeholder')}
             required />
    </Label>

    <Button type="submit" color="blue" class="w-full">
      {$t('lost_password_reset_password_button')}
    </Button>
  </form>
</Modal>
