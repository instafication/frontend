<script lang="ts">
  /* ───── UI kit ───── */
  import * as Dialog from "$lib/Components/ui/dialog/index.js";
  import { Button, Label, Input } from "flowbite-svelte";
  import { Loader2, Hand } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  /* managers & stores */
  import { signUp } from "$lib/Managers/AuthManager";
  import { showRegisterModal } from "$lib/sharedStore";

  /* i18n */
  import { t } from "$lib/i18n";

  /* ───────── reactive state ───────── */
  let email = $state("");
  let password = $state("");
  let loading = $state(false);

  /* ───────── helpers ───────── */
  const register = async (e?: Event) => {
    e?.preventDefault?.();
    if (loading) return;
    loading = true;
    try {
      // signUp throws on failure; no structured object is returned here
      await signUp(email, password);
      toast.success("Account created successfully");
    } catch (err: any) {
      toast.error("Error, can't create account. Try again.");
    } finally {
      loading = false;
    }
  };
</script>

<Dialog.Root bind:open={$showRegisterModal}>
  <!-- Optional trigger can be placed elsewhere -->
  <Dialog.Content class="w-full max-w-xs">
    <Dialog.Header>
      <Dialog.Title>{$t("register_new_account_title")}</Dialog.Title>
    </Dialog.Header>

    <!-- prevent reload in handler -->
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

      <Button type="submit" color="blue" class="w-full inline-flex items-center justify-center gap-2" disabled={loading}>
        {#if loading}
          <Loader2 class="w-4 h-4 animate-spin" />
        {/if}
        <span>{$t("register_your_account")}</span>
      </Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
