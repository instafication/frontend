<script lang="ts">
import { Button, Modal, Timeline } from 'flowbite-svelte';
import BrandsOnLandingPage from '$lib/Components/BrandsOnLandingPage.svelte';
import FAQ from '$lib/Components/FAQ.svelte';
import HeaderPhone from '$lib/Components/HeaderPhone.svelte';
import PriceSection from '$lib/Components/PriceSection.svelte';
import TimelineItem from '$lib/Components/TimelineItem.svelte';
import { t } from '$lib/i18n';
import { showInformationModal, showLoginModal, showRegisterModal } from '$lib/sharedStore';
import { notification_GetLatest } from './db.remote';

// Alias for backwards compatibility
const CardWithList = BrandsOnLandingPage;
</script>

<Modal
	title={$t('get_started_modal_title')}
	bind:open={$showInformationModal}
	placement="center"
	autoclose
>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		{$t('get_started_in_30_seconds')}

		{$t('get_started_modal_create_account')}
		{$t('get_started_modal_login')}
		{$t('3_book')}
		<br />
		<br />
		<b>{$t('1_register_account')}</b> Klicka uppe i högra hörnet för att registrera ett konto (eller
		logga in direkt med Google).
		<br />
		<br />
		<b>{$t('2_activate_notifications')}</b> Klicka på din profilbild uppe i högra hörnet och välj
		tjänster. Där kan du sedan aktivera vilka tjänster du vill få notifikationer för.
		<br />
		<br />
		<b>{$t('3_book')}</b> Logga in via företagets hemsida för att boka tiden som vanligt.
		<br />
		<br />
		Du kan även skapa en profil för att se dina krediter via vår hemsida. Har du redan ett konto så kan
		du enkelt logga in via knappen nedan.
	</p>
	<svelte:fragment slot="footer">
		<Button onclick={() => ($showRegisterModal = true)}
			>{$t('get_started_modal_create_account')}</Button
		>
		<Button onclick={() => ($showLoginModal = true)} color="alternative"
			>{$t('get_started_modal_login')}</Button
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
		<CardWithList />
	</section>

	<section
		id="timeline"
		class="bg-white dark:bg-gray-900 bg-slate-0 border-gray-200 place-items-start justify-self-center md:justify-self-start"
	>
		<div
			class="w-full max-w-md p-8 bg-gray-0 border border-gray-200 text-left rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700"
		>
			<Timeline>
				<svelte:boundary>
					{#each await notification_GetLatest(3) as notification}
						<TimelineItem
							customDiv={'bg-green-300'}
							title="Ny tvättid hittad för Stockholms studentbostäder"
							date={notification.date?.toString() ?? undefined}
						>
							<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
								{notification.body}
							</p>
						</TimelineItem>
					{/each}
					{#snippet pending()}
						<p>Loading...</p>
					{/snippet}
				</svelte:boundary>
			</Timeline>
		</div>
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
	<section class="bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded-3xl">
		<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
			<div class="max-w-screen-md mb-8 lg:mb-16">
				<h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
					{$t('1_register_an_account')}
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					{$t('get_started_steps_step1_body')}
				</p>
			</div>
		</div>
	</section>

	<section class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded-3xl">
		<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
			<div class="max-w-screen-md mb-8 lg:mb-16">
				<h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
					{$t('2_wait_for_notifications')}
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					{$t('get_started_steps_step2_body')}
				</p>
			</div>
		</div>
	</section>

	<section class=" bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded-3xl">
		<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
			<div class="max-w-screen-md mb-8 lg:mb-16">
				<h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
					{$t('3_book_time_as_usual')}
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					{$t('get_started_steps_step3_body')}
				</p>
			</div>
		</div>
	</section>
</section>
