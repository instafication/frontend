<script>
  import { Card, Listgroup, Avatar, Badge } from "flowbite-svelte";
  import { showServicesModal, showLoginModal, userLoggedIn } from "$lib/sharedStore";
  import { getAllScrapers } from "$lib/Managers/ScrapingManager";
  import { t } from "$lib/i18n";

   let list = [
    {
      img: { src: "/images/favicon-sssb.svg", alt: "SSSB",},
      name: "Stockholms Studentbostäder",
      status: "Aktiv: " + Math.floor(Math.random() * 5) + " min sedan sökning",
      active: "green",
      services: [$t("laundry")]
    },

    {
      img: { src: "/images/hertz-logo.svg", alt: "Hertz" },
      name: "Hertz Freerider",
      status: $t("status_inactive"),
      active: "",
      services: [$t("rental_cars")]
    },
  ];

    const scrapers = [getAllScrapers()]
    console.log(scrapers);

</script>


<Card padding="xl" size="sm" class="border-1 rounded-3xl shadow-none bg-slate-0 dark:bg-gray-900 border-gray-200 border">

  <div class="flex items-center mb-8">
    <lord-icon
        src="https://cdn.lordicon.com/hdiorcun.json"
        trigger="loop"
        delay="4000"
        style="width:64px;height:64px">
    </lord-icon>
    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">{$t("pulse")}</h5>
  </div>

  <Listgroup items={list} let:item class="border-1 p-2 dark:!bg-transparent" on:click={() => {

    if ($userLoggedIn == true) 
      $showServicesModal = true;
    else
      $showLoginModal = true;
  
  }}>

    <div class="flex items-center space-x-4">
      <Avatar  size="md"  src={item.img.src} alt={item.img.alt} class="flex-shrink-0 bg-transparent"rounded dot={{color: item.active}}  />
      <div class="flex-1 min-w-0 py-2">
        
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          {item.name}
        </p>
        
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          <Badge rounded color="{item.active}">
            <svg aria-hidden="true" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
            {item.status}
          </Badge>
        </p>

        <div class="flex items-center">
        {#each item.services as service}
          <p class="text-sm text-gray-500 truncate dark:text-gray-400 py-0">
            <Badge rounded>
              {service}
            </Badge>
          </p>
        {/each}
        </div>



      </div>

    </div>
  </Listgroup>

</Card>