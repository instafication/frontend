<script lang="ts">
  /* ───── UI kit ───── */
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, Label, Input, Checkbox } from "flowbite-svelte";

  /* auth + stores */
  import {
    signInWithOAuth,
    signInWithPassword,
  } from "$lib/Managers/AuthManager";
  import {
    showLoginModal,
    showRegisterModal,
    showLostPasswordModal,
  } from "$lib/sharedStore";

  /* i18n */
   import { t } from "$lib/i18n";

  /* ───────── reactive state ───────── */
  let email = $state("");
  let password = $state("");

  /* ───────── actions ───────── */
  const handlePasswordLogin = async () => {
    await signInWithPassword(email, password);
  };

  const handleGoogleLogin = async () => {
    await signInWithOAuth();
  };

  function openLostPassword() {
    $showLostPasswordModal = true;
    $showLoginModal = false;
  }

  function openRegister() {
    $showRegisterModal = true;
    $showLoginModal = false;
  }
</script>

<Dialog.Root bind:open={$showLoginModal}>
  <!-- Optional trigger elsewhere; Dialog.Trigger omitted here -->

  <Dialog.Content class="w-full max-w-md">
    <Dialog.Header>
      <Dialog.Title>{$t("log_in_to_your_profile")}</Dialog.Title>
    </Dialog.Header>

    <!-- on:submit|preventDefault avoids page reload -->
    <form
      class="flex flex-col space-y-6"
      on:submit|preventDefault={handlePasswordLogin}
    >
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

      <div class="flex items-start">
        <Checkbox>{$t("remember_me")}</Checkbox>
        <button
          tabindex="-1"
          class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
          on:click={openLostPassword}
          type="button"
        >
          {$t("lost_password")}
        </button>
      </div>

      <!-- submit = password login -->
      <Button color="blue" type="submit" class="w-full">
        {$t("log_in_button")}
      </Button>

      <!-- google login -->
      <Button
        color="blue"
        type="button"
        class="w-full"
        on:click={handleGoogleLogin}
      >
        <svg
          class="w-4 h-4 mr-2 -ml-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
        {$t("log_in_with_google")}
      </Button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        {$t("not_registered")}
        <button
          class="text-blue-700 hover:underline dark:text-blue-500"
          on:click={openRegister}
          type="button"
        >
          {$t("create_an_account")}
        </button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
