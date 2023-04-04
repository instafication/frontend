<script lang="ts">
  import { Button, Modal, Label, Input} from 'flowbite-svelte';
  import { resetPasswordForEmail } from '../../Managers/AuthManager';

  let email: string = "";

  export let showLostPasswordModal: boolean = false;
</script>

<Modal bind:open={showLostPasswordModal} size="xs" autoclose={true} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Återställ ditt lösenord</h3>
    <Label class="space-y-2">
      <span>Din email</span>
      <Input bind:value={email} type="email" name="email" placeholder="e.x. namn@gmail.com" required />
    </Label>
    <Button on:click="{async() => {await resetPasswordForEmail(email)}}" type="submit" class="w-full1">Återställ lösenordet!</Button>
  </form>
</Modal>