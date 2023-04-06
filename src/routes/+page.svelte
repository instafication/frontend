<script lang="ts">
    import { getLatestNotifications } from '$lib/Managers/NotificationManager';
    import { Timeline, Button, Modal, Card } from 'flowbite-svelte';
    import  ModalLogin from '../lib/Components/Modal/ModalLogin.svelte';
    import ModalRegister from '../lib/Components/Modal/ModalRegister.svelte';
    import TimelineItem from '$lib/Components/TimelineItem.svelte';
  import CardWithList from '../lib/Components/CardWithList.svelte';


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
                möjligheter!</span> Få en notifikation via SMS direkt när någon avbokar.</h1>

        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
    <Button on:click={() => window.open("https://discord.gg/vqWC3m8U8c")} color="alternative">
        Chatta med oss
        <img src="/discord-mark-black.svg" alt="Discord" class="w-5 h-5 ml-2" />
    </Button>
    <Button on:click={() => showRegisterModal = true} color="alternative">
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
    </div>
</section>


<section class="bg-white dark:bg-gray-900 w-full grid md:grid-cols-2 grid-rows-1 gap-4 md:content-center md:items-stretch md:justify-start py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
    

    <section id="brands" class=" bg-slate-0 dark:bg-gray-900 border-gray-200  rounded grid grid-rows-1 md:grid-rows-2 gap-4 place-items-start justify-self-center md:justify-self-end">

        <CardWithList>

        </CardWithList>
            <!-- <div class="max-w-screen-md lg:mb-16">
                <img src="/images/sssb.svg" alt="logo" width="200px"/>
                Status: Söker efter nya tider...
            </div>

            <div class="max-w-screen-md lg:mb-16 bg-slate-100">
                <img src="/images/hertz-logo.svg" alt="logo" width="200px"/>
                Status: Kommer inom kort...
            </div> -->

    </section>

    <section id="timeline" class="bg-white dark:bg-gray-900 bg-slate-0 border-gray-200  place-items-start justify-self-center md:justify-self-start">

        <div class="w-full max-w-md p-8 bg-gray-0 border border-gray-200 text-left rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <!-- <div class="flex items-center mb-8">
              <lord-icon
                    src="https://cdn.lordicon.com/hdiorcun.json"
                    trigger="loop"
                    delay="4000"
                    style="width:64px;height:64px">
                </lord-icon> 
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Senast nytt</h5>
            </div> -->

            <Timeline>  
            <TimelineItem customDiv={"animate-ping bg-sky-200"} title="Tar pulsen och söker efter nya tider...">
                <Button  on:click={() => showInformationModal = true} color="alternative">Få notis via SMS!</Button>
            </TimelineItem>

                {#await getLatestNotifications(3) then notifications}
                    {#each notifications as notification}
                        <TimelineItem customDiv={"bg-green-300"} title="Ny tvättid hittad för Stockholms studentbostäder" date={notification.date}>
                        <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{notification.body}</p>
                        </TimelineItem>
                    {/each} 
                    
                {/await}
        </Timeline></div>

        <!-- <Timeline>  
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
        </Timeline> -->

    
    </section>


</section>




<section class="bg-white dark:bg-gray-900 w-full grid md:grid-cols-3 grid-rows-1 gap-4 content-center items-stretch justify-start py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

    <!-- <section class="w-full col-span-3 h-0 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Kom igång inom 30 sekunder!
    </section> -->

    <section class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

            <div class="max-w-screen-md mb-8 lg:mb-16">
                <lord-icon
                    src="https://cdn.lordicon.com/krmfspeu.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#121331,secondary:#08a88a"
                    style="width:62px;height:62px">
                </lord-icon>
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    1. Skicka SMS
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    Skicka "Start Medicinaren" eller "Start Jerum" till 0766867379 (6 notiser gratis).
                </p>
            </div>

        </div>
    </section>


    <section class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

            <div class="max-w-screen-md mb-8 lg:mb-16">
                                                        <lord-icon src="https://cdn.lordicon.com/msoeawqm.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#121331,secondary:#08a88a"
                    style="width:62px;height:62px">
                    </lord-icon>
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    2. Invänta notifikation
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    Vi kommer att skicka ut ett SMS till det nummer du
                    skrev start ifrån när vi hittar en ny tid.
                </p>
            </div>

        </div>
    </section>

        <section class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

            <div class="max-w-screen-md mb-8 lg:mb-16">
                    <lord-icon src="https://cdn.lordicon.com/lupuorrc.json"
                    trigger="loop"
                    delay="2000"
                    style="width:72px;height:72px">
                    </lord-icon>
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    3. Boka tiden som vanligt
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    Logga in via SSSB:s bokningssida för att boka tiden
                    som vanligt.
                </p>
            </div>

        </div>
    </section>


</section>