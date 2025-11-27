<script lang="ts">
import { type Accordion, Accordion as AccordionPrimitive } from 'bits-ui';
import { cn } from '$lib/utils.js';

let { ref = $bindable(null), class: className, ...restProps }: Accordion.ItemProps = $props();
</script>

<AccordionPrimitive.Item
	bind:ref
	data-slot="accordion-item"
	class={cn('border-b last:border-b-0', className)}
	{...restProps}
/>
