<script lang="ts">
import {
	DropdownMenu as DropdownMenuPrimitive,
	type DropdownMenu as DropdownMenuPrimitiveType
} from 'bits-ui';

let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitiveType.GroupProps = $props();
</script>

<DropdownMenuPrimitive.Group bind:ref data-slot="dropdown-menu-group" {...restProps} />
