<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
  import ModalRegister from './ModalRegister.svelte';
  import ModalLostPassword from './ModalLostPassword.svelte';
  import { signInWithOAuth, signInWithPassword } from '../../Managers/AuthManager';

  let showRegisterModal: boolean = false;
  let showLostPasswordModal: boolean = false;

  let email: string = "";
  let password: string = "";

  export let showLoginModal: boolean = false;
</script>

<ModalRegister bind:showRegisterModal />
<ModalLostPassword bind:showLostPasswordModal />

<Modal bind:open={showLoginModal} size="xs" autoclose={true} permanent={false} class="w-full">
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
        <a on:click={() => {showLostPasswordModal = true; showLoginModal = false;}} href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Förlorat lösenordet?</a>
    </div>
    <Button on:click="{async() => {await signInWithPassword(email, password)}}" type="submit" class="w-full1">Logga in!</Button>
    <Button on:click="{async() => {await signInWithOAuth()}}" type="submit" class="w-full1">Logga in med Google</Button>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Inte registrerad? <a on:click={() => {showRegisterModal = true; showLoginModal = false;}} href="/" class="text-blue-700 hover:underline dark:text-blue-500">Skapa ett konto</a>
      </div>
  </form>
</Modal>