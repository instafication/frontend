<script lang="ts">
  /* UI kit */
  import { Button, Modal, Label, Input } from 'flowbite-svelte';

  /* managers & stores */
  import { signUp } from '$lib/Managers/AuthManager';
  import { showRegisterModal } from '$lib/sharedStore';

  /* i18n */
  import { t } from '$lib/i18n';

  /* ───────── reactive state ───────── */
  let email    = $state('');
  let password = $state('');

  /* ───────── helpers ───────── */
  const register = async () => {
    await signUp(email, password);
  };
</script>

<Modal bind:open={$showRegisterModal}
       size="xs"
       autoclose
       class="w-full">

  <form class="flex flex-col space-y-6"
        on:submit|preventDefault={register}>

    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      {$t('register_new_account_title')}
    </h3>

    <Label class="space-y-2">
      <span>{$t('your_email')}</span>
      <Input bind:value={email}
             type="email"
             name="email"
             placeholder={$t('email_placeholder')}
             required />
    </Label>

    <Label class="space-y-2">
      <span>{$t('your_password')}</span>
      <Input bind:value={password}
             type="password"
             name="password"
             placeholder={$t('password_placeholder')}
             required />
    </Label>

    <Button type="submit" color="blue" class="w-full">
      {$t('register_your_account')}
    </Button>
  </form>
</Modal>
