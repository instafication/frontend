<script lang="ts">
    import { Timeline, Button, Modal } from "flowbite-svelte";
    import {
        showInformationModal,
        showRegisterModal,
        showLoginModal,
    } from "$lib/sharedStore";
    import { getLatestNotifications } from "$lib/Managers/NotificationManager";
    import TimelineItem from "$lib/Components/TimelineItem.svelte";
    import CardWithList from "$lib/Components/BrandsOnLandingPage.svelte";
    import { t } from "$lib/i18n";
    import PriceSection from "$lib/Components/PriceSection.svelte";
    import HeaderPhone from "$lib/Components/HeaderPhone.svelte";
    import FAQ from "$lib/Components/FAQ.svelte";
</script>

<Modal
    title={$t("get_started_modal_title")}
    bind:open={$showInformationModal}
    placement="center"
    autoclose
>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        {$t("get_started_in_30_seconds")}

        {$t("get_started_modal_create_account")}
        {$t("get_started_modal_login")}
        {$t("3_book")}
        <br />
        <br />
        <b>{$t("1_register_account")}</b> Klicka uppe i högra hörnet för att
        registrera ett konto (eller logga in direkt med Google).
        <br />
        <br />
        <b>{$t("2_activate_notifications")}</b> Klicka på din profilbild uppe i
        högra hörnet och välj tjänster. Där kan du sedan aktivera vilka tjänster
        du vill få notifikationer för.
        <br />
        <br />
        <b>{$t("3_book")}</b> Logga in via företagets hemsida för att boka tiden
        som vanligt.
        <br />
        <br />
        Du kan även skapa en profil för att se dina krediter via vår hemsida. Har
        du redan ett konto så kan du enkelt logga in via knappen nedan.
    </p>
    <svelte:fragment slot="footer">
        <Button onclick={() => ($showRegisterModal = true)}
            >{$t("get_started_modal_create_account")}</Button
        >
        <Button onclick={() => ($showLoginModal = true)} color="alternative"
            >{$t("get_started_modal_login")}</Button
        >
    </svelte:fragment>
</Modal>

<section class="bg-white dark:bg-gray-900">
    <HeaderPhone />
</section>

<section
    class="bg-white dark:bg-gray-900 w-full grid md:grid-cols-2 grid-rows-1 gap-4 md:content-center md:items-stretch md:justify-start py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6"
>
    <section
        id="brands"
        class=" bg-slate-0 dark:bg-gray-900 border-gray-200 grid grid-rows-1 md:grid-rows-2 gap-4 place-items-start justify-self-center md:justify-self-end"
    >
        <CardWithList/>

        <!-- <div class="max-w-screen-md lg:mb-16 bg-slate-100">
                <img src="/images/hertz-logo.svg" alt="logo" width="200px"/>
                Status: Kommer inom kort...
            </div>  -->
    </section>

    <section
        id="timeline"
        class="bg-white dark:bg-gray-900 bg-slate-0 border-gray-200 place-items-start justify-self-center md:justify-self-start"
    >
        <div
            class="w-full max-w-md p-8 bg-gray-0 border border-gray-200 text-left rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700"
        >
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
                <TimelineItem
                    customDiv={"animate-ping bg-sky-200"}
                    title={$t("checking_pulse_searching_new_times")}
                >
                    <!-- <Button  onclick={() => showInformationModal = true} color="alternative">Få notis via SMS!</Button> -->
                </TimelineItem>

                {#await getLatestNotifications(3) then notifications}
                    {#each notifications as notification}
                        <TimelineItem
                            customDiv={"bg-green-300"}
                            title="Ny tvättid hittad för Stockholms studentbostäder"
                            date={notification.date}
                        >
                            <p
                                class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400"
                            >
                                {notification.body}
                            </p>
                        </TimelineItem>
                    {/each}
                {/await}
            </Timeline>
        </div>

        <!-- <Timeline>  
            <TimelineItem customDiv={"animate-ping bg-sky-200"} title="Söker efter nya tider...">
                <Button  onclick={() => showInformationModal = true} color="alternative">Få notis via SMS!</Button>
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

<section
    class="bg-white dark:bg-gray-900 w-full grid md:grid-cols-1 grid-rows-1 gap-4 content-center items-stretch justify-start py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6"
>
    <PriceSection />
</section>

<section
    class="bg-white dark:bg-gray-900 w-full content-center items-stretch justify-start py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6"
>
    <FAQ />
</section>

<section
    class="bg-white dark:bg-gray-900 w-full grid md:grid-cols-3 gap-4 content-center items-stretch justify-start py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6"
>
    <!-- <section class="w-full col-span-all text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Kom igång inom 30 sekunder!
    </section> -->

    <section
        class="bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded-3xl"
    >
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div class="max-w-screen-md mb-8 lg:mb-16">
                <lord-icon
                    src="https://cdn.lordicon.com/krmfspeu.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#121331,secondary:#08a88a"
                    style="width:62px;height:62px"
                >
                </lord-icon>
                <h2
                    class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
                >
                    {$t("1_register_an_account")}
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    {$t("get_started_steps_step1_body")}
                </p>
            </div>
        </div>
    </section>

    <section
        class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded-3xl"
    >
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div class="max-w-screen-md mb-8 lg:mb-16">
                <lord-icon
                    src="https://cdn.lordicon.com/msoeawqm.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#121331,secondary:#08a88a"
                    style="width:62px;height:62px"
                >
                </lord-icon>
                <h2
                    class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
                >
                    {$t("2_wait_for_notifications")}
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    {$t("get_started_steps_step2_body")}
                </p>
            </div>
        </div>
    </section>

    <section
        class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded-3xl"
    >
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div class="max-w-screen-md mb-8 lg:mb-16">
                <lord-icon
                    src="https://cdn.lordicon.com/lupuorrc.json"
                    trigger="loop"
                    delay="2000"
                    style="width:72px;height:72px"
                >
                </lord-icon>
                <h2
                    class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
                >
                    {$t("3_book_time_as_usual")}
                </h2>
                <p class="text-gray-500 sm:text-xl dark:text-gray-400">
                    {$t("get_started_steps_step3_body")}
                </p>
            </div>
        </div>
    </section>
</section>
