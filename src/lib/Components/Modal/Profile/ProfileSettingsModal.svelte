<script lang="ts">
  /* UI kit -------------------------------------------------------------- */
  import { Button, Modal, Label, Input } from 'flowbite-svelte';

  /* managers & stores --------------------------------------------------- */
  import { getUserId } from '$lib/Managers/AuthManager';
  import { updateProfileById } from '$lib/Managers/ProfileManager';
  import { trpc } from '$lib/trpc/client';
  import { showProfileSettingsModal } from '$lib/sharedStore';

  /* svelte internals & i18n -------------------------------------------- */
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';

  /* ---------- local state (reactive & bind-able) ----------------------- */
  let id   = $state('');   // not user-editable but set later
  let email = $state('');
  let phone = $state('');

  /* ---------- lifecycle ------------------------------------------------ */
  async function loadUserData() {
    id = await getUserId();
    [email, phone] = await Promise.all([
      trpc.email.query(id),
      trpc.phone.query(id)
    ]);
  }

  onMount(loadUserData);

  /* ---------- actions -------------------------------------------------- */
  const handleSave = async () => {
    await updateProfileById(id, email, phone);
  };
</script>

<Modal bind:open={$showProfileSettingsModal}
       size="xs"
       autoclose
       class="w-full">
  <form class="flex flex-col space-y-6"
        on:submit|preventDefault={handleSave}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      {$t('profile_settings')}
    </h3>

    <Label class="space-y-2">
      <span>{$t('profile_your_email')}</span>
      <Input bind:value={email}
             type="email"
             name="email"
             placeholder={$t('profile_email_placeholder')}
             required />
    </Label>

    <Label class="space-y-2">
      <span>{$t('profile_your_phone_number')}</span>
      <Input bind:value={phone}
             type="tel"
             name="phoneNumber"
             placeholder="+46707749377"
             required />
    </Label>

    <Button type="submit" class="w-full">
      {$t('profile_save_changes')}
    </Button>
  </form>
</Modal>
