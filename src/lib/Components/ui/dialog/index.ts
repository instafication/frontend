// Re-export the bits-ui Dialog namespace for components that need Root/Portal
export { Dialog } from 'bits-ui';

// Custom wrapper components
import Close from './dialog-close.svelte';
import Content from './dialog-content.svelte';
import Description from './dialog-description.svelte';
import Footer from './dialog-footer.svelte';
import Header from './dialog-header.svelte';
import Overlay from './dialog-overlay.svelte';
import Title from './dialog-title.svelte';
import Trigger from './dialog-trigger.svelte';

export {
	Close,
	Close as DialogClose,
	Content,
	Content as DialogContent,
	Description,
	Description as DialogDescription,
	Footer,
	Footer as DialogFooter,
	Header,
	Header as DialogHeader,
	Overlay,
	Overlay as DialogOverlay,
	Title,
	//
	Title as DialogTitle,
	Trigger,
	Trigger as DialogTrigger
};
