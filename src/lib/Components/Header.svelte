<script lang="ts">
    import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, Button} from 'flowbite-svelte'
    import ModalLogin from './Modal/ModalLogin.svelte'
    import ModalRegister from './Modal/ModalRegister.svelte'


let showLoginModal = false;
let showRegisterModal = false;

</script>

<ModalLogin bind:showLoginModal />
<ModalRegister bind:showRegisterModal/>
<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <img src="images/logo.png" class="mr-3 h-6 sm:h-9" alt="BlinkSMS Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BlinkSMS</span>
  </NavBrand>

    <NavHamburger on:click={toggle} />

  <NavUl {hidden} class="order-1">
    <NavLi href="#" on:click="{() => showLoginModal = true}"><Button  color="alternative">Logga in</Button></NavLi>
    <NavLi href="#" on:click="{() => showRegisterModal = true}"><Button>Registrera!</Button></NavLi>
    <!-- <Button size="sm">Registrera</Button> -->
  </NavUl>
</Navbar>