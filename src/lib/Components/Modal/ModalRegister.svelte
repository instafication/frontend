<script lang="ts">
  import { Button, Modal, Label, Input } from 'flowbite-svelte'
	import { signUp } from '$lib/Managers/AuthManager';
  import { showRegisterModal } from '$lib/sharedStore';
  import { t } from '$lib/i18n';

	let email: string = "";
  let password: string = "";
</script>

<Modal bind:open={$showRegisterModal} size="xs" autoclose={true} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">{$t('register_new_account_title')}</h3>
    <Label class="space-y-2">
      <span>{$t('your_email')}</span>
      <Input bind:value={email} type="email" name="email" placeholder="{$t('email_placeholder')}" required />
    </Label>
    <Label class="space-y-2">
      <span>{$t('your_password')}</span>
      <Input bind:value={password} type="password" name="password" placeholder="{$t('password_placeholder')}" required />
    </Label>
    <Button color="blue" on:click={async() => {await signUp(email, password)}} type="button" class="w-full1">{$t('register_your_account')}</Button>
  </form>
</Modal>


<!-- <Modal bind:open={$showRegisterModal} size="xs" autoclose={true} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Registrera ett nytt konto</h3>
    <Label class="space-y-2">
      <span>Din email</span>
      <Input bind:value={email} type="email" name="email" placeholder="e.x. namn@icloud.com" required />
    </Label>
    <Label class="space-y-2">
      <span>Ditt lösenord</span>
      <Input bind:value={password} type="password" name="password" placeholder="•••••" required />
    </Label>
    <Button on:click={async() => {await signUp(email, password)}} type="button" class="w-full1">Registrera ditt konto!</Button>
  </form>
</Modal> -->