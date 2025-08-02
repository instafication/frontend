<script lang="ts">
  import clsx from 'clsx';
  import { getContext } from 'svelte';

  /* ---------- props ---------- */
  interface TimelineItemProps {
    title?: string;
    date?: string;
    customDiv?: string;
    customTimeClass?: string;
    /* snippets */
    children?: () => unknown;   // default content
    icon?: () => unknown;       // named slot “icon”
  }

  // runes-mode prop declaration
  let {
    title = '',
    date = '',
    customDiv = '',
    customTimeClass = '',
    children,          // default slot snippet
    icon               // named slot snippet
  } = $props<TimelineItemProps>();

  /* ---------- context ---------- */
  type Order =
    | 'default'
    | 'vertical'
    | 'horizontal'
    | 'activity'
    | 'group'
    | 'custom';

  const order: Order = getContext<Order>('order') ?? 'default';

  /* ---------- static class maps ---------- */
  const liClasses = {
    default: 'mb-10 ml-4',
    vertical: 'mb-10 ml-6',
    horizontal: 'relative mb-6 sm:mb-0',
    activity: 'mb-10 ml-6',
    group: ''
  } as const;

  const divBase = {
    vertical:
      'flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900',
    horizontal: 'flex items-center',
    activity:
      'flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900',
    group:
      'p-5 mb-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700'
  } as const;

  const timeBase = {
    default:
      'mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500',
    vertical:
      'block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500',
    horizontal:
      'block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500',
    activity:
      'mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0',
    group: 'text-lg font-semibold text-gray-900 dark:text-white'
  } as const;

  /* ---------- derived helpers ---------- */
  const divClass = $derived(() => {
    if (order === 'default')
      return `${customDiv} absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700`;
    if (order === 'custom') return customDiv;
    return divBase[order];
  });

  const timeClass = $derived(() =>
    order === 'custom' ? customTimeClass : timeBase[order] ?? customTimeClass
  );

  const h3Class = $derived(() =>
    clsx((
      order === 'vertical'
        ? 'flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white'
        : 'text-lg font-semibold text-gray-900 dark:text-white'
    )
  ));

  /* ---------- fallback icon HTML ---------- */
  const defaultIconHtml = /*html*/`
    <svg aria-hidden="true"
         class="w-3 h-3 text-blue-600 dark:text-blue-400"
         fill="currentColor"
         viewBox="0 0 20 20"
         xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"/>
    </svg>`;
</script>

<li class={liClasses[order]}>
  {#if order === "default"}
    <div class={divClass}></div>
    {#if date}<time class={timeClass}>{date}</time>{/if}
    {#if title}<h3 class={h3Class}>{title}</h3>{/if}
    {@render children?.()}
  {:else if order === "vertical"}
    <div class={divClass}></div>
    {#if icon}
      {@render icon()}
    {:else}
      {@html defaultIconHtml}
    {/if}
    {#if title}<h3 class={h3Class}>{title}</h3>{/if}
    {#if date}<time class={timeClass}>{date}</time>{/if}
    {@render children?.()}
  {:else if order === "horizontal"}
    <div class={divClass}></div>
    {#if icon}
      {@render icon()}
    {:else}
      {@html defaultIconHtml}
    {/if}
    {#if title}<h3 class={h3Class}>{title}</h3>{/if}
    {#if date}<time class={timeClass}>{date}</time>{/if}
    {@render children?.()}
  {:else}
    <div class={divClass}></div>
    {#if icon}
      {@render icon()}
    {:else}
      {@html defaultIconHtml}
    {/if}
    {#if title}<h3 class={h3Class}>{title}</h3>{/if}
    {#if date}<time class={timeClass}>{date}</time>{/if}
    {@render children?.()}
  {/if}
</li>
