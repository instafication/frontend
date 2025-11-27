<script lang="ts">
import { createEventDispatcher } from 'svelte';

const {
	checked = $bindable(false),
	disabled = false,
	value,
	class: className,
	children,
	...restProps
} = $props();

const dispatch = createEventDispatcher();

// Generate a unique id per component instance for a11y label association
const checkboxId = `chk-${Math.random().toString(36).slice(2, 9)}`;

function handleChange(event: Event) {
	const target = event.target as HTMLInputElement;
	dispatch('change', { checked: target.checked });
}
</script>

<div class="flex items-center">
	<input
		id={checkboxId}
		type="checkbox"
		class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 {className ||
			''}"
		bind:checked
		{disabled}
		{value}
		onchange={handleChange}
		{...restProps}
	/>
	{#if children}
		<label for={checkboxId} class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
			{@render children?.()}
		</label>
	{/if}
</div>
