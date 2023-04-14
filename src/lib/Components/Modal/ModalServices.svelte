<script lang="ts">
	import { onMount } from 'svelte';
	import { Avatar, Badge, Button, Modal, Label, Select } from 'flowbite-svelte';
	import { createService, getServiceConfiguration } from '$lib/Managers/ServiceManager';
	import { showServicesModal } from '$lib/sharedStore';
    import { t } from '$lib/i18n';


	interface Service {
		img: {
			src: string; // "/images/favicon-sssb.svg"
			alt: string; // "Logotyp Stockholms Studentbostäder"
		};
		name: string; // "Stockholms Studentbostäder"
		status: string; // "Aktiv: 5 min sedan sökning"
		active: string; // "green"
		services: string[]; // ["Tvättid"]
		notificationMethod: string;
		options: {};
	}


	 let serviceList: Service = [
		{
			img: { src: "/images/favicon-sssb.svg", alt: "Logotyp Stockholms Studentbostäder",},
			name: "Stockholms Studentbostäder",
			status: "Aktiv: " + Math.floor(Math.random() * 5) + " min sedan sökning",
			active: "green",
			services: ["Tvättid"],
		},
	];


	const Items1 = [
		{value:"Medicinaren", name: "Medicinaren"},
		{value:"Lappkärrsberget", name: "Lappkärrsberget"},
		{value:"Jerum", name: "Jerum"},
	]
	const Items2 = [
		{value: "1800", name: "Inom 30 minuter"},
		{value: "10800", name: "Inom 3 timmar"},
		{value: "28800", name: "Inom 8 timmar"},
		{value: "86400", name: "Inom 24 timmar"},
		{value: "172800", name: "Inom 2 dagar"},
		{value: "259200", name: "Inom 3 dagar"},
	]
	const Items3 = [
		{value: "Email", name: "E-post"},
	]

	let SelectedValue1Area: [] = [];
	let SelectedValue2Within: [] = [];
	let SelectedValue3Notification: [] = [];

	let Placeholder1: string = "Välj..";
	let Placeholder2: string = "Välj.."
	let Placeholder3: string = "Välj.."





	onMount(async () => {
		loadServiceDataByUUID();
	})
	async function loadServiceDataByUUID() {
		const serviceConfig: {} = await getServiceConfiguration("Stockholms Studentbostäder");
		console.log("[ModalServices] serviceConfig: ", serviceConfig);
		
		if (serviceConfig) {
			SelectedValue1Area = serviceConfig.options.area;
			SelectedValue2Within = serviceConfig.notificationWithin;
			SelectedValue3Notification = serviceConfig.notification;
		}

	}


</script>







<Modal bind:open={$showServicesModal} size="md">

	<h3 class="text-xl font-medium text-gray-900 dark:text-white">{$t("SERVICES_TITLE")}</h3>
	
	<section class="bg-white dark:bg-gray-900 grid md:grid-cols-auto grid-rows-1 gap-4 md:content-center md:items-stretch md:justify-start py-8 px-8 mx-auto max-w-screen-xl">
		

	
		<section id="1" class="bg-slate-0 border-2 rounded-md py-6 dark:bg-gray-900 border-gray-200 grid grid-rows-auto md:grid-rows-auto gap-4 place-items-start justify-self-center md:justify-self-end">

			<div class="flex-1 min-w-0 py-6 px-6">
				<span class="relative flex h-3 w-3">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
				</span>

					<Avatar src="/images/favicon-sssb.svg" alt="Logo" class="flex-shrink-0"/>
					<p class="text-xl font-normal text-gray-900 truncate dark:text-white">
						Stockholms Studentbostäder
					</p>
					
					<p class="text-sm text-gray-500 truncate dark:text-gray-400">
						<Badge rounded color="green">
							<svg aria-hidden="true" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
							Aktiv: 5 minuter sedan
						</Badge>
					</p>

					<div class="flex items-center mb-8">

						<p class="text-sm text-gray-500 truncate dark:text-gray-400">
							<Badge rounded>Tvättid</Badge>
						</p>


					</div>

						<form>
				 
							<div class="mb-2">
								<Label>{$t("SERVICES_OPTION1_TITLE")}</Label>
								<Select size="sm" class="mt-2" items={Items3} bind:value={SelectedValue3Notification} placeholder={Placeholder3} />  
							</div>

							<div class="mb-2">
									<Label>{$t("SERVICES_OPTION2_TITLE")}</Label>
									<Select size="sm" class="mt-2" items={Items2} bind:value={SelectedValue2Within} placeholder={Placeholder2} />
							</div>

							<div class="mb-2">
								<Label>{$t("SERVICES_OPTION3_TITLE")}</Label>
								<Select size="sm" class="mt-2" items={Items1} bind:value={SelectedValue1Area} placeholder={Placeholder1} />
							</div>

						</form>

					</div>


		</section>



		<!-- <section id="2" class="bg-white dark:bg-gray-900 bg-slate-0 border-gray-200  place-items-start justify-self-center md:justify-self-start">



			<Listgroup items={list} let:item class="border-1 dark:!bg-transparent">
				<ListgroupItem class="flex items-center space-x-4">

			<div class="items-center space-x-4">

				<span class="relative flex h-3 w-3">
					<span class="animate-pulse absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
				</span>
				
				<div class="flex-0 min-w-0">



					<Avatar src="/images/hertz-logo.svg" alt="Logo hertz" class="flex-shrink-0"/>
					<p class="text-xl font-normal text-gray-900 truncate dark:text-white">
						Hertz Freerider
					</p>
					
					<p class="text-sm text-gray-500 truncate dark:text-gray-400">
						<Badge rounded color="default">
							<svg aria-hidden="true" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
							Inaktiv: Aktiveras inom kort...
						</Badge>
					</p>

					<div class="flex items-center mb-6">

						<p class="text-sm text-gray-500 truncate dark:text-gray-400">
							<Badge rounded>
								Hyrbilar 
							</Badge>
						</p>


					</div>

						<form>
							<div class="grid gap-6 mb-6 md:grid-cols-1">
								<div>
							<div class="mb-2">

								<Label>Från stad:
								<Select size="sm" disabled class="mt-2" items={} bind:value={} />
							</Label>

							</div>
							<div class="mb-2">

									<div class="mb-2">

									<Label>Till stad:
									<Select size="sm" disabled class="mt-2" items={} bind:value={} />
									</Label>

									</div>
								
							</div>
														<div class="mb-2">

									<div class="mb-2">

									 <Label>Välj frekvens:
									<Select disabled class="mt-2" items={} bind:value={} />
									</Label>

									</div>
								
							</div>
						</form>

					</div>

			</div>
			</ListgroupItem>
		 </Listgroup>

		</section> -->


</section>

<!-- name: string, notification: string, notificationWithIn: number, options: {} -->
	<Button on:click={async() => {

		if (SelectedValue3Notification == null || SelectedValue2Within == null || SelectedValue1Area == null ||
			SelectedValue3Notification == "" || SelectedValue2Within == "" || SelectedValue1Area == "") {
			alert("Du måste fylla i alla fält innan du sparar.");
			return;
		} else {
			await createService("Stockholms Studentbostäder", SelectedValue3Notification, SelectedValue2Within, {"area": SelectedValue1Area});
			alert("Ändringarna har sparats.");
		}
		}}
		>
		{$t("SERVICES_BUTTON1")}</Button>

</Modal>