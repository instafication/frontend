<script lang="ts">
    import { getLatestNotifications } from '$lib/Managers/NotificationManager';
    import { Timeline, Button, Modal, Card } from 'flowbite-svelte';
    import  ModalLogin from '../lib/Components/Modal/ModalLogin.svelte';
    import ModalRegister from '../lib/Components/Modal/ModalRegister.svelte';
    import TimelineItem from '$lib/Components/TimelineItem.svelte';


    let showInformationModal: boolean = false;
    let showLoginModal: boolean = false;
    let showRegisterModal: boolean = false;
</script>

<ModalLogin bind:showLoginModal/>
<ModalRegister bind:showRegisterModal/>

<Modal title="Kom igång inom 30 sekunder" bind:open={showInformationModal} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Kom igång enkelt inom 30 sekunder och få fem gratis notifikationer via SMS när det finns lediga tider. Gör följande:
    <br>
    <br>
    <b>1. Skicka:</b> Skriv ett meddelande med texten "Start Medicinaren", "Start Jerum" eller "Start Lappkärrsberget" till 0766867379 (5 notiser gratis).
    <br>
    <br>
    <b>2. Invänta notifikation:</b> Vi kommer att skicka ut ett SMS till det nummer du skrev start ifrån när vi hittar en ny tid.
    <br>
    <br>
    <b>3. Boka:</b> Logga in via SSSB:s bokningssida för att boka tiden som vanligt. 
    <br>
    <br>
    Du kan även skapa en profil för att se dina krediter via vår hemsida. Har du redan ett konto så kan du enkelt logga in via knappen nedan.
    </p>
  <svelte:fragment slot='footer'>
    <Button on:click={() => showRegisterModal = true}>Skapa ett konto</Button>
    <Button on:click={() => showLoginModal = true} color="alternative">Logga in</Button>
  </svelte:fragment>
</Modal>


<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <!-- <a href="#" class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
            <span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">Nyhet</span> <span class="text-sm font-medium">Hemsida och system för notifikationer!</span>
            <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </a> -->

        <!-- <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Server status: Online</span> -->
        <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Missa inga
                möjligheter!</span> Få en notifikation via SMS direkt när någon avbokar en tvättid.</h1>

        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
    <Button on:click={() => window.open("https://discord.gg/vqWC3m8U8c")} color="alternative">
        Chatta med oss
        <img src="/discord-mark-black.svg" alt="Discord" class="w-5 h-5 ml-2" />
    </Button>
    <Button on:click={() => window.open("discordInviteUrl")} color="alternative">
        Skapa ett konto
        <lord-icon
    src="https://cdn.lordicon.com/wcjauznf.json"
    trigger="hover"
    colors="primary:#000"
    stroke="50"
    scale="40"
    style="width:32px;height:32px">
        </lord-icon>
        </Button>
</div>

        </div>
        <!-- <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-72">
            <span class="font-semibold text-gray-400 uppercase">FÖLJ OSS</span>
            <div class="flex flex-wrap justify-center items-center mt-3 text-gray-500 sm:justify-between">
                <div><img src="/images/sssb.svg" alt="logo" width="200px"></div>
                <div><img src="/images/aptus.svg" alt="logo" width="128px" /></div>
            </div>
        </div> -->
    </div>
</section>


<section class="bg-white dark:bg-gray-900 ">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
             <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-72">
            <!-- <span class="font-semibold text-gray-400 uppercase">TJÄNSTER SOM STÖDJS</span> -->
            <div class="flex flex-wrap justify-center items-center mt-1 text-gray-500">
                <!-- <div><img src="/images/sssb.svg" alt="logo" width="200px"></div>
                <div><img src="/images/aptus.svg" alt="logo" width="128px" /></div> -->

    <Timeline>

    <TimelineItem customDiv={"animate-ping bg-sky-200"} title="Söker efter nya tider...">
        <Button  on:click={() => showInformationModal = true} color="alternative">Få notis via SMS!</Button>
    </TimelineItem>

    {#await getLatestNotifications(3) then notifications}
        {#each notifications as notification}
            <TimelineItem customDiv={"bg-green-300"} title="Ny tvättid hittad för Stockholms studentbostäder" date={notification.date}>
            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{notification.body}</p>
            </TimelineItem>
        {/each} 
        
    {/await}

    </Timeline>
    </div>
</section>

<!-- 
<Card padding="xl">
  <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Standard plan</h5>
  <div class="flex items-baseline text-gray-900 dark:text-white">
      <span class="text-3xl font-semibold">$</span>
      <span class="text-5xl font-extrabold tracking-tight">49</span>
      <span class="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
  </div>

  <ul class="my-7 space-y-4">
      <li class="flex space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">2 team members</span>
      </li>
      <li class="flex space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">20GB Cloud storage</span>
      </li>
      <li class="flex space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Integration help</span>
      </li>
      <li class="flex space-x-2 line-through decoration-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500">Sketch Files</span>
      </li>
      <li class="flex space-x-2 line-through decoration-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500">API Access</span>
      </li>
      <li class="flex space-x-2 line-through decoration-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500">Complete documentation</span>
      </li>
      <li class="flex space-x-2 line-through decoration-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base font-normal leading-tight text-gray-500">24×7 phone & email support</span>
      </li>
  </ul>
  <Button class="w-full">Välj prisplan</Button>
</Card> -->


<!-- <section class="bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">

        </div>

    </div>
</section> -->

<section id="start" class="bg-slate-50 dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div class="max-w-screen-md mb-8 lg:mb-16">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Kom igång inom
                30 sekunder!</h2>

            <p class="text-gray-500 sm:text-xl dark:text-gray-400">Testa gratis enkelt och smidigt genom
                följande tre steg nedan</p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div>
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                    <script src="https://cdn.lordicon.com/ritcuqlt.js"></script>
                    <lord-icon src="https://cdn.lordicon.com/rhvddzym.json" trigger="loop">
                    </lord-icon>
                </div>
                <h3 class="mb-2 text-xl font-bold dark:text-white">1. Skicka</h3>
                <p class="text-gray-500 dark:text-gray-400">Skicka "Start Medicinaren" eller "Start Jerum" till 0766867379 (6 notiser gratis).
                </p>
            </div>
            <div>
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                    <script src="https://cdn.lordicon.com/ritcuqlt.js"></script>
                    <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" delay="1000" colors="primary:#121331,secondary:#08a88a" style="width:50px;height:50px">
                    </lord-icon>
                </div>
                <h3 class="mb-2 text-xl font-bold dark:text-white">2. Invänta notifikation</h3>
                <p class="text-gray-500 dark:text-gray-400">Vi kommer att skicka ut ett SMS till det nummer du
                    skrev start ifrån när vi hittar en ny tid.</p>
            </div>
            <div>
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                    <script src="https://cdn.lordicon.com/ritcuqlt.js"></script>
                    <lord-icon src="https://cdn.lordicon.com/lupuorrc.json" trigger="loop" delay="1000" style="width:150px;height:150px">
                    </lord-icon>
                </div>
                <h3 class="mb-2 text-xl font-bold dark:text-white">3. Boka</h3>
                <p class="text-gray-500 dark:text-gray-400">Logga in via SSSB:s bokningssida för att boka tiden
                    som vanligt.</p>
            </div>

        </div>
    </div>
</section>







