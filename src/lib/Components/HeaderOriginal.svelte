<script lang="ts">

    import { t } from "$lib/i18n";
    import { showRegisterModal } from "$lib/sharedStore";
    import { Button } from "flowbite-svelte";

</script>
 
<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <!-- <a href="#" class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
            <span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">Nyhet</span> <span class="text-sm font-medium">Hemsida och system för notifikationer!</span>
            <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </a>

        <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Server status: Online</span> -->
        <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                {$t("dont_miss_opportunities1")}
            </span>
            {$t("dont_miss_opportunities2")}
        </h1>

        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">

        <Button onclick={() => $showRegisterModal = true} color="alternative">
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