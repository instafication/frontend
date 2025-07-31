<script lang="ts">
  import { onMount } from "svelte";
  import * as Dialog from "$lib/Components/ui/dialog/index.js";
  import * as Select from "$lib/Components/ui/select/index.js";
  import { Button } from "$lib/Components/ui/button/index.js";
  import { Avatar, Label } from "flowbite-svelte";
  import Save from "@lucide/svelte/icons/save";
  import { Loader } from "@lucide/svelte";

  import {
    createService,
    getServiceConfiguration,
  } from "$lib/Managers/ServiceManager";
  import { showServicesModal } from "$lib/sharedStore";
  import { t } from "$lib/i18n";
    import { toast } from "svelte-sonner";

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
  let loading = $state<boolean>(false);

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
      toast.error("Du måste fylla i alla fält innan du sparar.");
      return;
    }
    
    loading = true;
    try {
      await createService(
        "Stockholms Studentbostäder",
        selectedNotificationMethod,
        Number(selectedWithinTime),
        { area: selectedArea },
      );
      toast.success("Ändringarna har sparats.");
    } finally {
      loading = false;
    }
  }
</script>

<Dialog.Root bind:open={$showServicesModal} onOpenChange={(open) => console.log("Services modal open:", open)}>
  <Dialog.Content class="w-full max-w-md">
    <Dialog.Header>
      <Dialog.Title>
        {$t("SERVICES_TITLE")}
      </Dialog.Title>
    </Dialog.Header>

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
      <Button variant="outline" onclick={handleSave} disabled={loading}>
        {#if loading}
          <Loader class="w-4 h-4 mr-1 animate-spin" />
        {:else}
          <Save class="w-4 h-4 mr-1" />
        {/if}
        {$t("SERVICES_BUTTON1")}
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
