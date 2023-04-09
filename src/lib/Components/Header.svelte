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

    <!-- <lord-icon
    src="https://cdn.lordicon.com/alnsmmtf.json"
    trigger="hover"
    colors="primary:#4be1ec,secondary:#cb5eee"
    stroke="90"
    style="width:64px;height:64px">
    </lord-icon> -->

<!-- <lord-icon
    src="https://cdn.lordicon.com/tyounuzx.json"
    trigger="hover"
    colors="primary:#121331,secondary:#3080e8"
    stroke="90"
    style="width:64px;height:64px">
</lord-icon> -->


    <img src="images/logo.png" class="mr-3 h-6 sm:h-9" alt="BlinkSMS Logo"/>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BlinkSMS</span>
  </NavBrand>

    <NavHamburger on:click={toggle} />

  <NavUl {hidden} class="order-1">
    <NavLi href="#" on:click="{() => showLoginModal = true}"><Button color="alternative">
      Logga in 
      <script src="https://cdn.lordicon.com/ritcuqlt.js"></script>
<script src="https://cdn.lordicon.com/ritcuqlt.js"></script>
<lord-icon
    src="https://cdn.lordicon.com/rqqkvjqf.json"
    trigger="hover"
    colors="primary:#121331,secondary:#12133"
    stroke="40"
    scale="40"
    style="width:32px;height:32px">
</lord-icon>
    </Button></NavLi>
    <NavLi href="#" on:click="{() => showRegisterModal = true}"><Button>
      Registrera
<lord-icon
    src="https://cdn.lordicon.com/wcjauznf.json"
    trigger="hover"
    colors="primary:#FFF,secondary:#FFF"
    stroke="50"
    scale="40"
    style="width:32px;height:32px">
</lord-icon>
    </Button></NavLi>
    <!-- <Button size="sm">Registrera</Button> -->
  </NavUl>
</Navbar>