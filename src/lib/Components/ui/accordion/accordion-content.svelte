<script lang="ts">
import { type Accordion, Accordion as AccordionPrimitive } from 'bits-ui';
import type { WithoutChild } from '$lib/utils.js';
import { cn } from '$lib/utils.js';

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithoutChild<Accordion.ContentProps> = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
	{...restProps}
>
	<div class={cn('pb-4 pt-0', className)}>
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
