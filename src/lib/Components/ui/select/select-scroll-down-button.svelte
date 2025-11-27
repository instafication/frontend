<script lang="ts">
import { ChevronDown as ChevronDownIcon } from '@lucide/svelte';
import { Select as SelectPrimitive, type Select as SelectPrimitiveType } from 'bits-ui';
import type { WithoutChildrenOrChild } from '$lib/utils.js';
import { cn } from '$lib/utils.js';

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildrenOrChild<SelectPrimitiveType.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
	bind:ref
	data-slot="select-scroll-down-button"
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronDownIcon class="size-4" />
</SelectPrimitive.ScrollDownButton>
