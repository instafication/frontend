<script lang="ts">
  /* ───── UI kit ───── */
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import {
    Avatar,
    Badge,
    Button,
    Label,
    Select,
  } from "flowbite-svelte";

  /* managers & stores --------------------------------------------------- */
  import {
    createService,
    getServiceConfiguration,
  } from "$lib/Managers/ServiceManager";
  import { showServicesModal } from "$lib/sharedStore";

  /* i18n & lifecycle ---------------------------------------------------- */
  import { t } from "$lib/i18n";
  import { onMount } from "svelte";

  /* ---------- static data --------------------------------------------- */
  const ItemsArea = [
    { value: "Medicinaren", name: "Medicinaren" },
    { value: "Lappkärrsberget", name: "Lappkärrsberget" },
    { value: "Jerum", name: "Jerum" },
  ] as const;

  const ItemsWithin = [
    { value: "1800", name: "Inom 30 minuter" },
    { value: "10800", name: "Inom 3 timmar" },
    { value: "28800", name: "Inom 8 timmar" },
    { value: "86400", name: "Inom 24 timmar" },
    { value: "172800", name: "Inom 2 dagar" },
    { value: "259200", name: "Inom 3 dagar" },
  ] as const;

  const ItemsNotification = [{ value: "Email", name: "E-post" }] as const;

  /* ---------- reactive state ------------------------------------------ */
  let selectedArea = $state(""); // e.g. "Medicinaren"
  let selectedWithin = $state(""); // e.g. "1800"
  let selectedNotification = $state(""); // e.g. "Email"

  const placeholder = "Välj…";

  /* ---------- load persisted config ----------------------------------- */
  async function loadServiceData() {
    const cfg: any = await getServiceConfiguration(
      "Stockholms Studentbostäder"
    );
    if (cfg) {
      selectedArea = cfg.options?.area ?? "";
      selectedWithin = cfg.notificationWithin ?? "";
      selectedNotification = cfg.notification ?? "";
    }
  }
  onMount(loadServiceData);

  /* ---------- helpers ------------------------------------------------- */
  function validateForm() {
    return selectedArea && selectedWithin && selectedNotification;
  }

  async function handleSave() {
    if (!validateForm()) {
      alert("Du måste fylla i alla fält innan du sparar.");
      return;
    }
    await createService(
      "Stockholms Studentbostäder",
      selectedNotification,
      selectedWithin,
      { area: selectedArea }
    );
    alert("Ändringarna har sparats.");
  }
</script>

<Dialog.Root bind:open={$showServicesModal}>
  <Dialog.Content class="w-full max-w-md" placement="center">
    <!-- header -->
    <Dialog.Header>
      <Dialog.Title>{$t("SERVICES_TITLE")}</Dialog.Title>
    </Dialog.Header>

    <!-- content -->
    <section
      class="bg-white dark:bg-gray-900 grid md:grid-cols-auto gap-4 py-8 px-8 mx-auto max-w-screen-xl"
    >
      <!-- service card ---------------------------------------------------- -->
      <section
        id="sssb"
        class="border-2 rounded-md py-6 px-6 grid gap-4 place-items-start bg-slate-0 dark:bg-gray-900 border-gray-200"
      >
        <!-- status + title -->
        <div class="flex items-center gap-4">
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
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
              class="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            Aktiv: 5&nbsp;minuter sedan
          </Badge>
        </p>

        <div class="flex items-center mb-4">
          <Badge rounded>Tvättid</Badge>
        </div>

        <!-- form ---------------------------------------------------------- -->
        <form class="w-full space-y-4">
          <div>
            <Label>{$t("SERVICES_OPTION1_TITLE")}</Label>
            <Select
              size="sm"
              class="mt-2"
              items={ItemsNotification}
              bind:value={selectedNotification}
              placeholder={placeholder}
            />
          </div>

          <div>
            <Label>{$t("SERVICES_OPTION2_TITLE")}</Label>
            <Select
              size="sm"
              class="mt-2"
              items={ItemsWithin}
              bind:value={selectedWithin}
              placeholder={placeholder}
            />
          </div>

          <div>
            <Label>{$t("SERVICES_OPTION3_TITLE")}</Label>
            <Select
              size="sm"
              class="mt-2"
              items={ItemsArea}
              bind:value={selectedArea}
              placeholder={placeholder}
            />
          </div>
        </form>
      </section>
    </section>

    <!-- actions -->
    <div class="mt-6">
      <Button onclick={handleSave}>{$t("SERVICES_BUTTON1")}</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
