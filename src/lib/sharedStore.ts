import { writable } from 'svelte/store';

export let showInformationModal = writable<boolean>(false);
export let showLoginModal = writable<boolean>(false);
export let showRegisterModal = writable<boolean>(false);
export let showServicesModal = writable<boolean>(false);
export let showLostPasswordModal = writable<boolean>(false);
export let showProfileSettingsModal = writable<boolean>(false);