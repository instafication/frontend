<script lang="ts">
import { type Accordion, Accordion as AccordionPrimitive } from 'bits-ui';

let { ref = $bindable(null), value = $bindable(), ...restProps }: Accordion.RootProps = $props();
</script>

<AccordionPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="accordion"
	{...restProps}
/>
