<script lang="ts">
  import { Navbar, NavBrand, NavUl } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { showLoginModal, showRegisterModal } from "$lib/sharedStore";
  import LanguageSelector from "./LanguageSelector.svelte";
  import { t } from "$lib/i18n";
</script>

<Navbar class="px-0">
  <div
    class="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
  >
    <!-- logo / brand -->
    <NavBrand href="/">
      <img
        src="/images/logo.png"
        class="mr-3 h-6 sm:h-9"
        alt="Instafication Logo"
      />
      <span
        class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      >
        Instafication
      </span>
    </NavBrand>

    <!-- right-hand tools -->
    <div class="flex items-center">
      <!-- log-in -->
      <Button
        variant="outline"
        onclick={() => {
          console.log("Login button clicked");
          $showLoginModal = true;
        }}
        color="alternative"
        class="cursor-pointer mr-2"
      >
        <lord-icon
          src="https://cdn.lordicon.com/rqqkvjqf.json"
          trigger="hover"
          colors="primary:#121331"
          stroke="48"
          scale="48"
          style="width:24px;height:24px"
        ></lord-icon>
        <span>{$t("log_in")}</span>
      </Button>

      <!-- register -->
      <Button
        onclick={() => {
          $showRegisterModal = true;
        }}
        class="cursor-pointer mr-2 bg-blue-700 hover:bg-blue-800"
      >
        <lord-icon
          src="https://cdn.lordicon.com/wcjauznf.json"
          trigger="hover"
          colors="primary:#FFF"
          stroke="48"
          scale="48"
          style="width:24px;height:24px"
        ></lord-icon>
        {$t("register")}
      </Button>

      <LanguageSelector />
    </div>

    <!-- mobile hamburger -->
    <!-- <NavHamburger /> -->
  </div>

  <!-- main nav links -->
  <!-- <NavUl
    class="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
  ></NavUl> -->
</Navbar>
