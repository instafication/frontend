<script lang="ts">
  /* ───── UI kit ───── */
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, Label, Input } from "flowbite-svelte";

  /* managers & stores */
  import { signUp } from "$lib/Managers/AuthManager";
  import { showRegisterModal } from "$lib/sharedStore";

  /* i18n */
  import { t } from "$lib/i18n";

  /* ───────── reactive state ───────── */
  let email = $state("");
  let password = $state("");

  /* ───────── helpers ───────── */
  const register = async () => {
    await signUp(email, password);
  };
</script>

<Dialog.Root bind:open={$showRegisterModal}>
  <!-- Optional trigger can be placed elsewhere -->
  <Dialog.Content class="w-full max-w-xs" placement="center">
    <Dialog.Header>
      <Dialog.Title>{$t("register_new_account_title")}</Dialog.Title>
    </Dialog.Header>

    <!-- onsubmit|preventDefault avoids page reload -->
    <form class="flex flex-col space-y-6" onsubmit={register}>
      <Label class="space-y-2">
        <span>{$t("your_email")}</span>
        <Input
          bind:value={email}
          type="email"
          name="email"
          placeholder={$t("email_placeholder")}
          required
        />
      </Label>

      <Label class="space-y-2">
        <span>{$t("your_password")}</span>
        <Input
          bind:value={password}
          type="password"
          name="password"
          placeholder={$t("password_placeholder")}
          required
        />
      </Label>

      <Button type="submit" color="blue" class="w-full">
        {$t("register_your_account")}
      </Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
