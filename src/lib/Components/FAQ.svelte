<script>
    import { t } from "$lib/i18n";


    import { Accordion, AccordionItem } from "flowbite-svelte";

</script>

<p class="mt-2 text-4xl font-bold text-left md:text-center tracking-tight text-gray-900 sm:text-5xl py-14">{$t("FAQ_TITLE")}</p>

<Accordion>

  <AccordionItem>
      <span slot="header">{$t("FAQ_Q1")}</span>
      <div slot="arrowup">
      <svg class="w-6 h-6 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
      </div>
      <span slot="arrowdown">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
      </span>
      <p class="mb-2 text-gray-500 dark:text-gray-400">{$t("FAQ_A1")}</p>
  </AccordionItem>

  <AccordionItem>
      <span slot="header">{$t("FAQ_Q2")}</span>
      <div slot="arrowup">
      <svg class="w-6 h-6 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
      </div>
      <span slot="arrowdown">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
      </span>
      <p class="mb-2 text-gray-500 dark:text-gray-400">{$t("FAQ_A2")}</p>
  </AccordionItem>

  <AccordionItem>
      <span slot="header">{$t("FAQ_Q3")}</span>
    <div slot="arrowup">
      <svg class="w-6 h-6 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
    </div>
    <span slot="arrowdown">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
    </span>
    <p class="mb-2 text-gray-500 dark:text-gray-400">
        {$t("FAQ_A3")}
    </p>
  </AccordionItem>

  <AccordionItem>
    <span slot="header">{$t("FAQ_Q4")}</span>
    <div slot="arrowup">
      <svg class="w-6 h-6 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
    </div>
    <span slot="arrowdown">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
    </span>
    <p class="mb-2 text-gray-500 dark:text-gray-400">
      {$t("FAQ_A4")}
    </p>
  </AccordionItem>

  <AccordionItem>
    <span slot="header">{$t("FAQ_Q5")}</span>
    <div slot="arrowup">
      <svg class="w-6 h-6 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
    </div>
    <span slot="arrowdown">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
    </span>
    <p class="mb-2 text-gray-500 dark:text-gray-400">
        {$t("FAQ_A5")}
    </p>
  </AccordionItem>

</Accordion>