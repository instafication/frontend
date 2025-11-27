<script lang="ts">
import { Select as SelectPrimitive, type Select as SelectPrimitiveType } from 'bits-ui';

let { ref = $bindable(null), ...restProps }: SelectPrimitiveType.GroupProps = $props();
</script>

<SelectPrimitive.Group data-slot="select-group" {...restProps} />
