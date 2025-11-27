<script lang="ts">
import { ChevronUp as ChevronUpIcon } from '@lucide/svelte';
import { Select as SelectPrimitive, type Select as SelectPrimitiveType } from 'bits-ui';
import type { WithoutChildrenOrChild } from '$lib/utils.js';
import { cn } from '$lib/utils.js';

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildrenOrChild<SelectPrimitiveType.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	data-slot="select-scroll-up-button"
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronUpIcon class="size-4" />
</SelectPrimitive.ScrollUpButton>
