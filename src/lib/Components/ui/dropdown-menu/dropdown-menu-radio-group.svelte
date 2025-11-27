<script lang="ts">
import {
	DropdownMenu as DropdownMenuPrimitive,
	type DropdownMenu as DropdownMenuPrimitiveType
} from 'bits-ui';

let {
	ref = $bindable(null),
	value = $bindable(),
	...restProps
}: DropdownMenuPrimitiveType.RadioGroupProps = $props();
</script>

<DropdownMenuPrimitive.RadioGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-radio-group"
	{...restProps}
/>
