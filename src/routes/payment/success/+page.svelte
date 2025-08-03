<script lang="ts">
	import { Timeline, Button, Modal } from 'flowbite-svelte';
	import { showInformationModal, showRegisterModal, showLoginModal } from '$lib/sharedStore';
	import { getLatestNotifications } from '$lib/Managers/NotificationManager';
	import TimelineItem from '$lib/Components/TimelineItem.svelte';
	import CardWithList from '$lib/Components/BrandsOnLandingPage.svelte';
	import { t } from '$lib/i18n';
	import PriceSection from '$lib/Components/PriceSection.svelte';
	import HeaderPhone from '$lib/Components/HeaderPhone.svelte';
</script>

<svelte:head>
	<script lang="ts">
		gtag('event', 'conversion', {
			send_to: 'AW-11152082064/1PmeCM7m_ZgYEJCJ3cUp',
			transaction_id: ''
		});
	</script>
</svelte:head>

<div class="bg-white">
	<div class="relative isolate px-6 pt-14 lg:px-8">
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Tack för din betalning! 🎉
				</h1>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					Du kan nu klicka på knappen logga in för att logga in på ditt konto. Inloggning är den
					email du använde när du genomförde betalningen. Lösenordet är samma som din email. Du
					kommer även inom kort få ett mail med yteligare information. Ni kan kontakta oss på:
					Hello@instafication.shop vid frågor och funderingar.
				</p>
				<!-- <div class="mt-10 flex items-center justify-center gap-x-6">
          <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Logga in</a>
          <a href="https://instafication.shop" class="text-sm font-semibold leading-6 text-gray-900">Gå till startsida <span aria-hidden="true">→</span></a>
        </div> -->
			</div>
		</div>
		<!-- <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div> -->
	</div>
</div>
