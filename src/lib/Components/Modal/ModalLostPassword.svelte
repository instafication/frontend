<script lang="ts">
  /* ───── UI kit ───── */
  import * as Dialog from "$lib/Components/ui/dialog/index.js";
  import { Button, Label, Input } from "flowbite-svelte";

  /* managers & stores */
  import { resetPasswordForEmail } from "$lib/Managers/AuthManager";
  import { showLostPasswordModal } from "$lib/sharedStore";

  /* i18n */
  import { t } from "$lib/i18n";

  /* ───────── reactive state ───────── */
  let email = $state("");

  /* ───────── actions ───────── */
  const handleReset = async () => {
    await resetPasswordForEmail(email);
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

      <Button type="submit" color="blue" class="w-full">
        {$t("lost_password_reset_password_button")}
      </Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
