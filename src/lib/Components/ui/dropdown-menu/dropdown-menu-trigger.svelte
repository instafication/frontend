<script lang="ts">
import {
	DropdownMenu as DropdownMenuPrimitive,
	type DropdownMenu as DropdownMenuPrimitiveType
} from 'bits-ui';

let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitiveType.TriggerProps = $props();
</script>

<DropdownMenuPrimitive.Trigger bind:ref data-slot="dropdown-menu-trigger" {...restProps} />
