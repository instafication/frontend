<script lang="ts">
  import * as Dialog from "$lib/Components/ui/dialog/index.js";
  import { Button, Label, Input } from "flowbite-svelte";
  import { resetPasswordForEmail } from "$lib/Managers/AuthManager";
  import { showLostPasswordModal } from "$lib/sharedStore";
  import { RotateCcwKey, Loader2 } from '@lucide/svelte';
  import { t } from "$lib/i18n";


  let email = $state("");
  let isLoading = $state(false);


  const handleReset = async () => {
    isLoading = true;
    await resetPasswordForEmail(email);
    isLoading = false;
  };
</script>

<Dialog.Root bind:open={$showLostPasswordModal}>
  <Dialog.Content class="w-full max-w-xs">
    <Dialog.Header>
      <Dialog.Title>{$t("lost_password_reset_password")}</Dialog.Title>
    </Dialog.Header>

    <form
      class="flex flex-col space-y-6"
      onsubmit={handleReset}
    >
      <Label class="space-y-2">
        <span>{$t("lost_password_your_email")}</span>
        <Input
          bind:value={email}
          type="email"
          name="email"
          placeholder={$t("lost_password_email_placeholder")}
          required
        />
      </Label>

      <Button type="submit" color="blue" class="w-full" disabled={isLoading}>
        {#if isLoading}
          <Loader2 class="w-4 h-4 animate-spin mr-2" />
        {:else}
          <RotateCcwKey class="w-4 h-4 mr-2" /> 
        {/if}
        {$t("lost_password_reset_password_button")}
      </Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
