<script lang="ts">

    import { t } from "$lib/i18n";

</script>
<div class="relative isolate bg-white px-0 py-24 sm:py-0 lg:px-8">

  <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
    <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
  </div>

  <div class="mx-auto max-w-2xl text-left md:text-center lg:max-w-4xl">
    <!-- <h2 class="text-base font-semibold leading-7 text-indigo-600">{$t("pricing_modal_title")}</h2> -->
    <p class="mt-2 text-4xl font-bold  text-left md:text-center tracking-tight text-gray-900 sm:text-5xl">{$t("pricing_modal_title2")}</p>
  </div>
  <p class="mx-auto mt-6 max-w-2xl text-left md:text-center text-lg leading-8 text-gray-600">
    {$t("pricing_modal_body")}
  </p>


  <div class="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
    <div class="rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 bg-white/60 sm:mx-8 lg:mx-0 rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl">
      <h3 id="tier-hobby" class="text-base font-semibold leading-7 text-indigo-600">Basic</h3>
      <p class="mt-4 flex items-baseline gap-x-2">
        <span class="text-5xl font-bold tracking-tight text-gray-900">9,00 kr</span>
        <span class="text-base text-gray-500">{$t("pricing_modal_basic_refill")}</span>
      </p>
      <p class="mt-6 text-base leading-7 text-gray-600">{$t("pricing_modal_basic_body")}</p>
      <ul role="list" class="mt-8 space-y-3 text-sm leading-6 sm:mt-10 text-gray-600">
        <li class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          {$t("pricing_modal_basic_body_point1")}
        </li>

        <!-- <li class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          {$t("pricing_modal_basic_body_point2")}
        </li> -->

      </ul>
      <a href="https://buy.stripe.com/3csaIu4N5a0l5Fe3cc" aria-describedby="tier-hobby" class="mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600">
        {$t("pricing_modal_basic_button")}
      </a>
    </div>

    <div class="rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 relative bg-gray-900 shadow-2xl">
      <h3 id="tier-enterprise" class="text-base font-semibold leading-7 text-indigo-400">Premium</h3>
      <p class="mt-4 flex items-baseline gap-x-2">
        <span class="text-5xl font-bold tracking-tight text-white">19,00 kr</span>
        <span class="text-base text-gray-400">/{$t("month")}</span>
      </p>
      <p class="mt-6 text-base leading-7 text-gray-300">{$t("pricing_modal_premium_body")}</p>
      <ul role="list" class="mt-8 space-y-3 text-sm leading-6 sm:mt-10 text-gray-300">
        <li class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          {$t("pricing_modal_premium_body_point1")}
        </li>

        <!-- <li class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          {$t("pricing_modal_premium_body_point2")}
        </li> -->

        <li class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          {$t("pricing_modal_premium_body_point3")}
        </li>

        <li class="flex gap-x-3">
          <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          {$t("pricing_modal_premium_body_point4")}
        </li>

      </ul>
      <a href="https://buy.stripe.com/8wM9Eq2EX1tP2t2eUV" aria-describedby="tier-enterprise" class="mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500">
        {$t("pricing_modal_premium_button")}
      </a>
    </div>
  </div>
</div>
