<script lang="ts">
  import { Card, Avatar, Badge } from 'flowbite-svelte';
  import { t } from '$lib/i18n';
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
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
            ></span>
          </span>
          <Avatar src="/images/favicon-sssb.svg" alt="Logo" size="xs" />
          <p class="text-xl font-normal text-gray-900 dark:text-white">
            Stockholms Studentbostäder
          </p>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          <Badge rounded color="green">
            <svg
              aria-hidden="true"
              class="w-3 h-3 mr-1 inline"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 
                   10-2 0v4a1 1 0 
                   00.293.707l2.828 2.829a1 1 0 
                   101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            Aktiv: 5 minuter sedan
          </Badge>
        </p>

      </section>
    </section>

</Card>
