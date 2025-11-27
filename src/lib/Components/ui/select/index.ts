// Re-export the bits-ui Select namespace for components that need Root
export { Select } from 'bits-ui';

// Custom wrapper components
import Content from './select-content.svelte';
import Group from './select-group.svelte';
import GroupHeading from './select-group-heading.svelte';
import Item from './select-item.svelte';
import Label from './select-label.svelte';
import ScrollDownButton from './select-scroll-down-button.svelte';
import ScrollUpButton from './select-scroll-up-button.svelte';
import Separator from './select-separator.svelte';
import Trigger from './select-trigger.svelte';

export {
	Group,
	Label,
	Item,
	Content,
	Trigger,
	Separator,
	ScrollDownButton,
	ScrollUpButton,
	GroupHeading,
	//
	Group as SelectGroup,
	Label as SelectLabel,
	Item as SelectItem,
	Content as SelectContent,
	Trigger as SelectTrigger,
	Separator as SelectSeparator,
	ScrollDownButton as SelectScrollDownButton,
	ScrollUpButton as SelectScrollUpButton,
	GroupHeading as SelectGroupHeading
};
