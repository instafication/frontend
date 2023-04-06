<script>
  import { Card, Listgroup, Avatar, Badge } from "flowbite-svelte";
   let list = [
    {
      img: { src: "/images/favicon-sssb.svg", alt: "SSSB",},
      name: "Stockholms Studentbostäder",
      status: "Aktiv: " + Math.floor(Math.random() * 5) + " min sedan sökning",
      active: "green"
    },

    {
      img: { src: "/images/hertz-logo.svg", alt: "Hertz freerider" },
      name: "Hertz Freerider",
      status: "Inaktiv: Kommer inom kort",
      active: "red"
    },
  ];
</script>


<Card padding="xl" size="sm" class="border-1 shadow-none bg-slate-0 dark:bg-gray-900 border-gray-200 border rounded">

  <div class="flex justify-between items-center mb-4">
      <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Företag vi tar pulsen på</h5>
  </div>

  <Listgroup items={list} let:item class="border-0 dark:!bg-transparent">

    <div class="flex items-center space-x-4">
      <Avatar src={item.img.src} alt={item.img.alt} class="flex-shrink-0"/>
      <div class="flex-1 min-w-0">
        
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          {item.name}
        </p>
        
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          <Badge color="{item.active}">{item.status}</Badge>
        </p>

      </div>

    </div>
  </Listgroup>

</Card>