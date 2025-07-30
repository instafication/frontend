<script lang="ts">
  /* UI kit -------------------------------------------------------------- */
  import { Card, Listgroup, Avatar, Badge } from 'flowbite-svelte';

  /* stores & managers --------------------------------------------------- */
  import {
    showServicesModal,
    showLoginModal,
    userLoggedIn
  } from '$lib/sharedStore';
  import { getAllScrapers } from '$lib/Managers/ScrapingManager';

  /* utilities & i18n ---------------------------------------------------- */
  import { getMinutesDiffFromUnixTimestamp } from '$lib/Inbox/Utils';
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';

  /* prisma types -------------------------------------------------------- */
  import type { Prisma, scrapers } from '@prisma/client';

  /* ---------- list item model ----------------------------------------- */
  interface ListItem {
    img: { src: string; alt: string };
    name: string;
    status: string;
    active: 'green' | 'red';
    services: string[];
  }

  /* ---------- reactive state ------------------------------------------ */
  let list = $state<ListItem[]>([]);

  /* ---------- pull data on mount -------------------------------------- */
  onMount(async () => {
    const scraperList: scrapers[] = await getAllScrapers();

    list = scraperList.map((scraper) => {
      const diffMinutes = getMinutesDiffFromUnixTimestamp(scraper.last_ping);
      const active: 'green' | 'red' =
        diffMinutes <= scraper.frequency * 2 ? 'green' : 'red';

      const params = scraper.params as Prisma.JsonArray;
      // @ts-expect-error  — params content is user-defined JSON
      const area = params?.area ?? '';

      return {
        img: {
          src: '/images/favicon-sssb.svg',
          alt: scraper.company
        },
        name: area,
        status: `${t('pulse_last_search')} ${diffMinutes} ${t('minutes_ago')}`,
        active,
        services: scraper.services
      };
    });
  });

  /* ---------- click handler ------------------------------------------- */
  function handleItemClick() {
    if ($userLoggedIn) {
      $showServicesModal = true;
    } else {
      $showLoginModal = true;
    }
  }
</script>

<Card
  padding="xl"
  size="sm"
  class="border-1 rounded-3xl shadow-none bg-slate-0 dark:bg-gray-900
         border-gray-200">

  <div class="flex items-center mb-8">
    <lord-icon
      src="https://cdn.lordicon.com/hdiorcun.json"
      trigger="loop"
      delay="4000"
      style="width:64px;height:64px"></lord-icon>
    <h5 class="ml-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
      {$t('pulse')}
    </h5>
  </div>

  <Listgroup
    items={list}
    let:item
    class="border-1 p-2 dark:!bg-transparent"
    onclick={handleItemClick}>

    <div class="flex items-center space-x-4">
      <!-- avatar + status dot -->
      <Avatar
        size="md"
        src={item.img.src}
        alt={item.img.alt}
        rounded
        class="flex-shrink-0 bg-transparent"
        dot={{ color: item.active }} />

      <div class="flex-1 min-w-0 py-2">
        <!-- name -->
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          {item.name}
        </p>

        <!-- last search -->
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          <Badge rounded color={item.active}>
            <svg
              aria-hidden="true"
              class="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd" />
            </svg>
            {item.status}
          </Badge>
        </p>

        <!-- services -->
        <div class="flex items-center flex-wrap gap-1">
          {#each item.services as service}
            <Badge rounded>{service}</Badge>
          {/each}
        </div>
      </div>
    </div>
  </Listgroup>
</Card>
