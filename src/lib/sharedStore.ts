import { writable } from 'svelte/store';

export const showInformationModal = writable<boolean>(false);
export const showLoginModal = writable<boolean>(false);
export const showRegisterModal = writable<boolean>(false);
export const showServicesModal = writable<boolean>(false);
export const showLostPasswordModal = writable<boolean>(false);
export const showProfileSettingsModal = writable<boolean>(false);

export const userLoggedIn = writable<boolean>(false);
export const selectedLanguage = writable<string>("sv");