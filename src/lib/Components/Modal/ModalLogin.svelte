<script lang="ts">

  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
  import { signInWithOAuth, signInWithPassword } from '$lib/Managers/AuthManager';
  import { showLoginModal, showRegisterModal, showLostPasswordModal } from '$lib/sharedStore';
  import { t } from '$lib/i18n';

  let email: string = "";
  let password: string = "";

</script>


<Modal bind:open={$showLoginModal} size="xs" autoclose={true} permanent={false} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">{$t('log_in_to_your_profile')}</h3>
    <Label class="space-y-2">
      <span>{$t('your_email')}</span>
      <Input bind:value={email} type="email" name="email" placeholder="{$t('email_placeholder')}" required />
    </Label>
    <Label class="space-y-2">
      <span>{$t('your_password')}</span>
      <Input bind:value={password} type="password" name="password" placeholder="{$t('password_placeholder')}" required />
    </Label>
    <div class="flex items-start">
        <Checkbox>{$t('remember_me')}</Checkbox>
        <a on:click={() => {$showLostPasswordModal = true; $showLoginModal = false;}} href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">{$t('lost_password')}</a>
    </div>
    <Button color="blue" on:click="{async() => {await signInWithPassword(email, password)}}" type="submit" class="w-full1">{$t('log_in_button')}</Button>
    <Button color="blue" on:click="{async() => {await signInWithOAuth()}}" type="submit" class="w-full1">
        <svg class="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
      {$t('log_in_with_google')}</Button>

<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
  {$t('not_registered')} <a on:click={() => {$showRegisterModal = true; $showLoginModal = false;}} href="/" class="text-blue-700 hover:underline dark:text-blue-500">{$t('create_an_account')}</a>
</div>
  </form>
</Modal>



<!-- <Modal bind:open={$showLoginModal} size="xs" autoclose={true} permanent={false} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Logga in till din profil</h3>
    <Label class="space-y-2">
      <span>Din email</span>
      <Input bind:value={email} type="email" name="email" placeholder="e.x. namn@gmail.com" required />
    </Label>
    <Label class="space-y-2">
      <span>Ditt lösenord</span>
      <Input bind:value={password} type="password" name="password" placeholder="•••••••••" required />
    </Label>
    <div class="flex items-start">
        <Checkbox>Kom ihåg mig</Checkbox>
        <a on:click={() => {$showLostPasswordModal = true; $showLoginModal = false;}} href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Förlorat lösenordet?</a>
    </div>
    <Button on:click="{async() => {await signInWithPassword(email, password)}}" type="submit" class="w-full1">Logga in!</Button>
    <Button on:click="{async() => {await signInWithOAuth()}}" type="submit" class="w-full1">
        <svg class="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
      Logga in med Google</Button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Inte registrerad? <a on:click={() => {$showRegisterModal = true; $showLoginModal = false;}} href="/" class="text-blue-700 hover:underline dark:text-blue-500">Skapa ett konto</a>
      </div>
  </form>
</Modal> -->