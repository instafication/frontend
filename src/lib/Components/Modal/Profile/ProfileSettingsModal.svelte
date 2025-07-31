<script lang="ts">
  /* -------- UI kit -------- */
  import * as Dialog from "$lib/Components/ui/dialog/index.js";
  import { Label, Input } from "flowbite-svelte";
  import { Button } from "$lib/Components/ui/button/index.js";

  /* managers & stores ----------------------------------------------- */
  import { getUserId } from "$lib/Managers/AuthManager";
  import { updateProfileById } from "$lib/Managers/ProfileManager";
  import { trpc } from "$lib/trpc/client";
  import { showProfileSettingsModal } from "$lib/sharedStore";

  /* svelte internals & i18n ----------------------------------------- */
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";

  /* ---------- local state (reactive & bind-able) -------------------- */
  let id = $state("");
  let email = $state("");
  let phone = $state("");

  /* ---------- lifecycle -------------------------------------------- */
  async function loadUserData() {
    id = await getUserId();
    [email, phone] = await Promise.all([
      trpc.email.query(id),
      trpc.phone.query(id),
    ]);
  }

  onMount(loadUserData);

  /* ---------- actions ---------------------------------------------- */
  const handleSave = async () => {
    await updateProfileById(id, email, phone);
    // close dialog after saving
    showProfileSettingsModal.set(false);
  };
</script>

<!-- Dialog ----------------------------------------------------------- -->
<Dialog.Root bind:open={$showProfileSettingsModal}>
  <!-- optional invisible trigger if you ever need imperative open() -->
  <Dialog.Trigger class="hidden" />

  <Dialog.Content class="w-full max-w-xs">
    <Dialog.Header>
      <Dialog.Title>{$t("profile_settings")}</Dialog.Title>
    </Dialog.Header>

    <form class="flex flex-col space-y-6" onsubmit={handleSave}>
      <Label class="space-y-2">
        <span>{$t("profile_your_email")}</span>
        <Input
          bind:value={email}
          type="email"
          name="email"
          placeholder={$t("profile_email_placeholder")}
          required
        />
      </Label>

      <Label class="space-y-2">
        <span>{$t("profile_your_phone_number")}</span>
        <Input
          bind:value={phone}
          type="tel"
          name="phoneNumber"
          placeholder="+46707749377"
          required
        />
      </Label>

      <Dialog.Footer>
        <Button variant="outline" type="submit" class="w-full">
          {$t("profile_save_changes")}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
