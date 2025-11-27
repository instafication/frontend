<script lang="ts">
import { Avatar as AvatarPrimitive, type Avatar as AvatarPrimitiveType } from 'bits-ui';
import { cn } from '$lib/utils.js';

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: AvatarPrimitiveType.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
	{...restProps}
/>
