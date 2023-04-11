<script lang="ts">

    import { Timeline, Button, Modal } from 'flowbite-svelte';
    import { showInformationModal, showRegisterModal, showLoginModal } from '$lib/sharedStore';
    import { getLatestNotifications } from '$lib/Managers/NotificationManager';
    import TimelineItem from '$lib/Components/TimelineItem.svelte';
    import CardWithList from "$lib/Components/BrandsOnLandingPage.svelte";
    import { t } from "$lib/i18n";

</script>


<Modal title={$t("get_started_modal_title")} bind:open={$showInformationModal} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    {$t("get_started_in_30_seconds")}

    {$t("get_started_modal_create_account")}
    {$t("get_started_modal_login")}
    {$t("3_book")}
    <br>
    <br>
    <b>{$t("1_register_account")}</b> Klicka uppe i högra hörnet för att registrera ett konto (eller logga in direkt med Google).
    <br>
    <br>
    <b>{$t("2_activate_notifications")}</b> Klicka på din profilbild uppe i högra hörnet och välj tjänster. Där kan du sedan aktivera vilka tjänster du vill få notifikationer för.
    <br>
    <br>
    <b>{$t("3_book")}</b> Logga in via företagets hemsida för att boka tiden som vanligt. 
    <br>
    <br>
    Du kan även skapa en profil för att se dina krediter via vår hemsida. Har du redan ett konto så kan du enkelt logga in via knappen nedan.
    </p>
  <svelte:fragment slot='footer'>
    <Button on:click={() => $showRegisterModal = true}>{$t("get_started_modal_create_account")}</Button>
    <Button on:click={() => $showLoginModal = true} color="alternative">{$t("get_started_modal_login")}</Button>
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
        <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                {$t("dont_miss_opportunities1")}
            </span>
            {$t("dont_miss_opportunities2")}
        </h1>

        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <Button on:click={() => window.open("https://discord.gg/SvWJAc4RNB")} color="alternative">
            <img src="/discord-mark-black.svg" alt="Discord" class="w-5 h-5 ml-2" />
            {$t("chat_with_us")}
        </Button>

        <Button on:click={() => $showRegisterModal = true} color="alternative">
                        <lord-icon
            src="https://cdn.lordicon.com/wcjauznf.json"
            trigger="hover"
            colors="primary:#000"
            stroke="50"
            scale="40"
            style="width:32px;height:32px">
            </lord-icon>
            {$t("get_started_modal_create_account")}
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
            <TimelineItem customDiv={"animate-ping bg-sky-200"} title={$t("checking_pulse_searching_new_times")}>
                <!-- <Button  on:click={() => showInformationModal = true} color="alternative">Få notis via SMS!</Button> -->
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
                    {$t("1_register_an_account")}
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    {$t("get_started_steps_step1_body")}
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
                    {$t("2_wait_for_notifications")}
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    {$t("get_started_steps_step2_body")}
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
                    {$t("3_book_time_as_usual")}
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    {$t("get_started_steps_step3_body")}
                </p>
            </div>

        </div>
    </section>


</section>