<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavHamburger,
    NavUl,
    NavLi,
    Button
  } from 'flowbite-svelte';

  import {
    showLoginModal,
    showRegisterModal
  } from '$lib/sharedStore';

  import LanguageSelector from './LanguageSelector.svelte';
  import { t } from '$lib/i18n';
</script>

<Navbar>
  <div class="flex items-center justify-between w-full">
    <!-- logo / brand -->
    <NavBrand href="/">
      <img src="/images/logo.png" class="mr-3 h-6 sm:h-9" alt="Instafication Logo" />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        Instafication
      </span>
    </NavBrand>

    <div class="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
      <!-- language selector -->
      <div class="flex items-center">
        <LanguageSelector />
      </div>
      
      <!-- log-in -->
      <Button onclick={() => ($showLoginModal = true)} color="alternative" class="mr-2">
        <lord-icon
          src="https://cdn.lordicon.com/rqqkvjqf.json"
          trigger="hover"
          colors="primary:#121331"
          stroke="40"
          scale="40"
          style="width:24px;height:24px"
        ></lord-icon>
        {$t('log_in')}
      </Button>

      <!-- register -->
      <Button onclick={() => ($showRegisterModal = true)} color="blue">
        <lord-icon
          src="https://cdn.lordicon.com/wcjauznf.json"
          trigger="hover"
          colors="primary:#FFF"
          stroke="50"
          scale="40"
          style="width:24px;height:24px"
        ></lord-icon>
        {$t('register')}
      </Button>
      
      <!-- mobile hamburger -->
      <!-- <NavHamburger /> -->
    </div>
  </div>

  <!-- main nav links -->
  <NavUl class="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    
  </NavUl>
</Navbar>
