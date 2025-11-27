<script lang="ts">
import { Loader2, Save } from '@lucide/svelte';
import { Avatar, Label } from 'flowbite-svelte';
import { onMount } from 'svelte';
import { toast } from 'svelte-sonner';
import { Button } from '$lib/Components/ui/button';
import {
	Dialog,
	Content as DialogContent,
	Header as DialogHeader,
	Title as DialogTitle
} from '$lib/Components/ui/dialog';
import {
	Select,
	Content as SelectContent,
	Group as SelectGroup,
	Item as SelectItem,
	Trigger as SelectTrigger
} from '$lib/Components/ui/select';
import { t } from '$lib/i18n';
import { getUserId } from '$lib/Managers/AuthManager';
import { showServicesModal } from '$lib/sharedStore';
import {
	service_CreateOrUpdate,
	service_GetConfigByCompanyName,
	service_RemoveByUserIdAndServiceName
} from '../../../routes/db.remote';

const AREA_LIST = [
	{ value: 'lappkärrsberget', label: 'lappkärrsberget' },
	{ value: 'kungshamra', label: 'kungshamra' }
] as const;

const WITHIN_TIME_LIST = [
	{ value: '1800', label: 'Inom 30 minuter' },
	{ value: '10800', label: 'Inom 3 timmar' },
	{ value: '28800', label: 'Inom 8 timmar' },
	{ value: '86400', label: 'Inom 24 timmar' },
	{ value: '172800', label: 'Inom 2 dagar' },
	{ value: '259200', label: 'Inom 3 dagar' }
] as const;

const NOTIFICATION_METHOD_LIST = [{ value: 'e-post', label: 'E-post' }] as const;

let selectedNotificationMethod = $state<string>('');
let selectedWithinTime = $state<string>('');
let selectedArea = $state<string>('');
let loading = $state<boolean>(false);
let hasActiveService = $state<boolean>(false);

interface ServiceConfig {
	notificationMethod?: string;
	notificationWithinTime?: string | number;
	options?: { area?: string };
}

onMount(async () => {
	const cfg = (await service_GetConfigByCompanyName({
		companyName: 'Stockholms Studentbostäder',
		userId: await getUserId()
	})) as ServiceConfig | null;
	if (cfg) {
		selectedNotificationMethod = cfg.notificationMethod ?? '';
		selectedWithinTime = String(cfg.notificationWithinTime ?? '');
		selectedArea = cfg.options?.area ?? '';
		hasActiveService = true;
	}
});

const placeholder = 'Välj…';

function validateForm() {
	return selectedNotificationMethod && selectedWithinTime && selectedArea;
}

async function toggleService() {
	if (!validateForm()) {
		toast.error('Du måste fylla i alla fält innan du sparar.');
		return;
	}
	loading = true;

	if (hasActiveService) {
		console.log(hasActiveService);
		const isRemoved: boolean = await service_RemoveByUserIdAndServiceName({
			userId: await getUserId(),
			serviceName: 'Stockholms Studentbostäder'
		});
		if (isRemoved) {
			toast.success('Bevakningen har tagits bort.');
			hasActiveService = false;
		} else {
			toast.error('Det gick inte att ta bort bevakningen.');
		}
	} else {
		const isCreated: boolean = await service_CreateOrUpdate({
			user: await getUserId(),
			name: 'Stockholms Studentbostäder',
			notificationMethod: selectedNotificationMethod,
			notificationWithinTime: Number(selectedWithinTime),
			options: { area: selectedArea }
		});
		if (isCreated) {
			toast.success('Bevakningen har skapats.');
			hasActiveService = true;
		} else {
			toast.error('Det gick inte att skapa bevakningen.');
		}
	}
	loading = false;
}
</script>

<Dialog.Root bind:open={$showServicesModal}>
	<DialogContent class="w-full max-w-md">
		<DialogHeader>
			<DialogTitle>
				{$t('SERVICES_TITLE')}
			</DialogTitle>
		</DialogHeader>

		<section
			class="bg-white dark:bg-gray-900 grid md:grid-cols-auto gap-0 py-6 px-0 mx-auto max-w-screen-xl"
		>
			<section
				id="sssb"
				class="border-2 rounded-md py-6 px-6 grid gap-4 bg-slate-0 dark:bg-gray-900 border-gray-200"
			>
				<div class="flex items-center gap-4">
					<div class="relative">
						<Avatar src="./images/sssb-favicon.svg" alt="SSSB Logo" size="sm" />
						<span class="absolute -top-1 -right-1 flex h-3 w-3">
							{#if hasActiveService}
								<span
									class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
								></span>
								<span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
							{:else}
								<span
									class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
								></span>
								<span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
							{/if}
						</span>
					</div>
					<p class="text-xl font-normal text-gray-900 dark:text-white">
						Stockholms Studentbostäder
					</p>
				</div>

				<form class="w-full space-y-4">
					<!-- Notification channel -->
					<div>
						<Label>{$t('SERVICES_OPTION1_TITLE')}</Label>
					<Select.Root type="single" bind:value={selectedNotificationMethod}>
						<SelectTrigger class="mt-2 w-full hover:cursor-pointer" disabled={loading}>
							{selectedNotificationMethod || placeholder}
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{#each NOTIFICATION_METHOD_LIST as item (item.value)}
									<SelectItem value={item.value} label={item.label} class="hover:cursor-pointer">
										{item.label}
									</SelectItem>
								{/each}
							</SelectGroup>
						</SelectContent>
					</Select.Root>
					</div>

					<!-- Time window -->
					<div>
						<Label>{$t('SERVICES_OPTION2_TITLE')}</Label>
					<Select.Root type="single" required bind:value={selectedWithinTime}>
						<SelectTrigger class="mt-2 w-full hover:cursor-pointer" disabled={loading}>
							{selectedWithinTime || placeholder}
						</SelectTrigger>
						<SelectContent class="hover:cursor-pointer">
							{#each WITHIN_TIME_LIST as item (item.value)}
								<SelectItem value={item.value} label={item.label} class="hover:cursor-pointer">
									{item.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select.Root>
					</div>

					<!-- Area -->
					<div>
						<Label>{$t('SERVICES_OPTION3_TITLE')}</Label>
					<Select.Root type="single" required bind:value={selectedArea}>
						<SelectTrigger class="mt-2 w-full hover:cursor-pointer" disabled={loading}>
							{selectedArea || placeholder}
						</SelectTrigger>
						<SelectContent>
							{#each AREA_LIST as item (item.value)}
								<SelectItem value={item.value} label={item.label} class="hover:cursor-pointer">
									{item.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select.Root>
					</div>
				</form>

				<Button
					variant="outline"
					onclick={toggleService}
					disabled={loading}
					class="hover:cursor-pointer {hasActiveService
						? 'bg-red-500 text-white hover:text-white hover:bg-red-600'
						: ''}"
				>
					{#if loading}
						<Loader2 class="w-4 h-4 mr-1 animate-spin" />
					{:else}
						<Save class="w-4 h-4 mr-1" />
					{/if}

					{#if hasActiveService}
						{$t('SERVICES_BUTTON1_ACTIVE')}
					{:else}
						{$t('SERVICES_BUTTON1')}
					{/if}
				</Button>
			</section>
		</section>
	</DialogContent>
</Dialog.Root>
