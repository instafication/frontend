<script lang="ts">
	import { t } from '$lib/i18n';
	/* Radix‑style accordion re‑export */
	import * as Accordion from '$lib/components/ui/accordion/index.js';
</script>

<p
	id="readmore"
	class="mt-2 text-4xl font-bold text-left md:text-center tracking-tight text-gray-900 sm:text-5xl py-14"
>
	{$t('FAQ_TITLE')}
</p>

<!-- one‑at‑a‑time accordion -->
<Accordion.Root type="single" collapsible class="w-full max-w-3xl mx-auto">
	<!-- Q1 -->
	<Accordion.Item value="q1" class="border-b last:border-b-0">
		<Accordion.Trigger
			class="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 hover:underline focus:outline-none"
		>
			{$t('FAQ_Q1')}
		</Accordion.Trigger>

		<Accordion.Content class="pb-4 pr-2 pl-1">
			<p class="text-gray-500 dark:text-gray-400">{$t('FAQ_A1')}</p>
		</Accordion.Content>
	</Accordion.Item>

	<!-- Q2 -->
	<Accordion.Item value="q2" class="border-b last:border-b-0">
		<Accordion.Trigger
			class="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 hover:underline focus:outline-none"
		>
			{$t('FAQ_Q2')}
		</Accordion.Trigger>

		<Accordion.Content class="pb-4 pr-2 pl-1">
			<p class="text-gray-500 dark:text-gray-400">{$t('FAQ_A2')}</p>
		</Accordion.Content>
	</Accordion.Item>

	<!-- Q3 -->
	<Accordion.Item value="q3" class="border-b last:border-b-0">
		<Accordion.Trigger
			class="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 hover:underline focus:outline-none"
		>
			{$t('FAQ_Q3')}
		</Accordion.Trigger>

		<Accordion.Content class="pb-4 pr-2 pl-1">
			<p class="text-gray-500 dark:text-gray-400">{$t('FAQ_A3')}</p>
		</Accordion.Content>
	</Accordion.Item>

	<!-- Q4 -->
	<Accordion.Item value="q4" class="border-b last:border-b-0">
		<Accordion.Trigger
			class="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 hover:underline focus:outline-none"
		>
			{$t('FAQ_Q4')}
		</Accordion.Trigger>

		<Accordion.Content class="pb-4 pr-2 pl-1">
			<p class="text-gray-500 dark:text-gray-400">{$t('FAQ_A4')}</p>
		</Accordion.Content>
	</Accordion.Item>

	<!-- Q5 -->
	<Accordion.Item value="q5">
		<Accordion.Trigger
			class="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 hover:underline focus:outline-none"
		>
			{$t('FAQ_Q5')}
		</Accordion.Trigger>

		<Accordion.Content class="pb-4 pr-2 pl-1">
			<p class="text-gray-500 dark:text-gray-400">{$t('FAQ_A5')}</p>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
