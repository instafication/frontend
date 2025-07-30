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
  <!-- logo / brand -->
  <NavBrand href="/">
    <img src="/images/logo.png" class="mr-3 h-6 sm:h-9" alt="Instafication Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      Instafication
    </span>
  </NavBrand>

  <!-- mobile hamburger -->
  <!-- <NavHamburger /> -->

  <!-- main nav links -->
  <NavUl class="order-1">
    <!-- log-in -->
    <NavLi href="#" onclick={() => ($showLoginModal = true)}>
      <Button color="alternative">
        <lord-icon
          src="https://cdn.lordicon.com/rqqkvjqf.json"
          trigger="hover"
          colors="primary:#121331"
          stroke="40"
          scale="40"
          style="width:32px;height:32px"
        ></lord-icon>
        {$t('log_in')}
      </Button>
    </NavLi>

    <!-- register -->
    <NavLi href="#" onclick={() => ($showRegisterModal = true)}>
      <Button color="blue">
        <lord-icon
          src="https://cdn.lordicon.com/wcjauznf.json"
          trigger="hover"
          colors="primary:#FFF"
          stroke="50"
          scale="40"
          style="width:32px;height:32px"
        ></lord-icon>
        {$t('register')}
      </Button>
    </NavLi>

    <!-- language selector -->
    <NavLi class="divide-y">
      <LanguageSelector />
    </NavLi>
    
  </NavUl>
</Navbar>
