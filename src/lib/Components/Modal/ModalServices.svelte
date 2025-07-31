<script lang="ts">
  import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Avatar, Badge, Label } from "flowbite-svelte";
  import { Save } from "@lucide/svelte";

  import {
    createService,
    getServiceConfiguration,
  } from "$lib/Managers/ServiceManager";
  import { showServicesModal } from "$lib/sharedStore";
  import { t } from "$lib/i18n";

  const AREA_LIST = [
    { value: "medicinaren", label: "Medicinaren" },
    { value: "lappkärrsberget", label: "Lappkärrsberget" },
    { value: "jerum", label: "Jerum" },
  ] as const;

  const WITHIN_TIME_LIST = [
    { value: "1800", label: "Inom 30 minuter" },
    { value: "10800", label: "Inom 3 timmar" },
    { value: "28800", label: "Inom 8 timmar" },
    { value: "86400", label: "Inom 24 timmar" },
    { value: "172800", label: "Inom 2 dagar" },
    { value: "259200", label: "Inom 3 dagar" },
  ] as const;

  const NOTIFICATION_METHOD_LIST = [
    { value: "e-post", label: "E-post" }
  ] as const;

  let selectedNotificationMethod = $state<string>("");
  let selectedWithinTime = $state<string>("");
  let selectedArea = $state<string>("");

  // const triggerContent = $derived(
  //   notifications.find((f) => f.value === selectedNotification)?.label ?? "Välj...",
  // );

  const placeholder = "Välj…";

  async function loadServiceData() {
    const cfg: any = await getServiceConfiguration(
      "Stockholms Studentbostäder",
    );
    if (cfg) {
      selectedNotificationMethod = cfg.notificationMethod ?? "";
      selectedWithinTime = String(cfg.notificationWithinTime ?? "");
      selectedArea = cfg.options?.area ?? "";
    }
  }
  onMount(loadServiceData);

  function validateForm() {
    return selectedNotificationMethod && selectedWithinTime && selectedArea;
  }

  async function handleSave() {
    if (!validateForm()) {
      alert("Du måste fylla i alla fält innan du sparar.");
      return;
    }
    await createService(
      "Stockholms Studentbostäder",
      selectedNotificationMethod,
      Number(selectedWithinTime),
      { area: selectedArea },
    );
    alert("Ändringarna har sparats.");
  }
</script>

<Dialog.Root bind:open={$showServicesModal}>
  <Dialog.Content class="w-full max-w-md" placement="center">
    <Dialog.Header>
      <Dialog.Title>{$t("SERVICES_TITLE")}</Dialog.Title>
    </Dialog.Header>

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

        <!-- <div class="flex items-center mb-4">
          <Badge rounded>Tvättid</Badge>
        </div> -->

        <form class="w-full space-y-4">
          <!-- Notification channel -->
          <div>
            <Label>{$t("SERVICES_OPTION1_TITLE")}</Label>
            <Select.Root type="single" bind:value={selectedNotificationMethod}>
              <Select.Trigger class="mt-2 w-full">
                {selectedNotificationMethod || placeholder}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each NOTIFICATION_METHOD_LIST as item (item.value)}
                    <Select.Item
                      value={item.value}
                      label={item.label}
                      >
                      {item.label}
                    </Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Time window -->
          <div>
            <Label>{$t("SERVICES_OPTION2_TITLE")}</Label>
            <Select.Root type="single" required bind:value={selectedWithinTime}>
              <Select.Trigger class="mt-2 w-full">
                {selectedWithinTime || placeholder}
              </Select.Trigger>
              <Select.Content>
                {#each WITHIN_TIME_LIST as item (item.value)}
                  <Select.Item
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Area -->
          <div>
            <Label>{$t("SERVICES_OPTION3_TITLE")}</Label>
            <Select.Root type="single" required bind:value={selectedArea}>
              <Select.Trigger class="mt-2 w-full">
                {selectedArea || placeholder}
              </Select.Trigger>
              <Select.Content>
                {#each AREA_LIST as item (item.value)}
                  <Select.Item
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </form>
      </section>
    </section>

    <div class="mt-6 text-right">
      <Button variant="outline" size="sm" onclick={handleSave}>
        <Save class="inline mr-1" />
        {$t("SERVICES_BUTTON1")}
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
