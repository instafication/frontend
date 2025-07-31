<script lang="ts">
  import { Card, Avatar } from 'flowbite-svelte';
  import { Badge } from '$lib/Components/ui/badge';
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { trpc } from '$lib/trpc/client';
  
  let lastSearchedMinutes = $state(0);
  let loading = $state(true);
  
  // Function to calculate minutes since last search
  function calculateMinutesSince(timestamp: number): number {
    if (timestamp <= 0) return 0;
    const now = Date.now();
    const diffMs = now - timestamp;
    return Math.floor(diffMs / 60000);
  }
  
  // Function to fetch last update time from database
  async function fetchLastUpdateTime() {
    try {
      loading = true;
      const data = await trpc.getLastUpdateByCompany.query('Stockholms Studentbostäder');
      lastSearchedMinutes = calculateMinutesSince(data.lastUpdate);
    } catch (error) {
      lastSearchedMinutes = 0;
    } finally {
      loading = false;
    }
  }
  
  // Fetch the last update time when component mounts
  onMount(() => {
    fetchLastUpdateTime();
  });
</script>

<Card
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


      <section
      class="bg-white dark:bg-gray-900 grid md:grid-cols-auto gap-4 py-8 px-8 mx-auto max-w-screen-xl"
    >
      <section
        id="sssb"
        class="border-2 rounded-md py-6 px-6 grid gap-4 bg-slate-0 dark:bg-gray-900 border-gray-200"
      >
        <div class="flex items-center gap-4">
          <div class="relative">
            <Avatar src="/images/favicon-sssb.svg" alt="Logo" size="sm" />
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
              ></span>
            </span>
          </div>
          <p class="text-xl font-normal text-gray-900 dark:text-white">
            Stockholms Studentbostäder
          </p>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          {#if loading}
            <Badge variant="default">
              Loading...
            </Badge>
          {:else}
            <Badge variant="default">
              Last searched: {lastSearchedMinutes} minutes ago
            </Badge>
          {/if}
        </p>

      </section>
    </section>

</Card>
