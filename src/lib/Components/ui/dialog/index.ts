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
	Title,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	Close,
	//
	Title as DialogTitle,
	Footer as DialogFooter,
	Header as DialogHeader,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Description as DialogDescription,
	Close as DialogClose
};
