<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  let {
    checked = $bindable(false),
    disabled = false,
    value,
    class: className,
    children,
    ...restProps
  } = $props();

  const dispatch = createEventDispatcher();

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch('change', { checked: target.checked });
  }
</script>

<div class="flex items-center">
  <input
    type="checkbox"
    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 {className || ''}"
    bind:checked
    {disabled}
    {value}
    on:change={handleChange}
    {...restProps}
  />
  {#if children}
    <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      {children}
    </label>
  {/if}
</div>