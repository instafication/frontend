import { selectedLanguage } from '$lib/sharedStore';
import translations from '$lib/translations';
import { derived } from 'svelte/store';

export const locales = Object.keys(translations);

function translate(selectedLanguage: string, key: string, vars) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error('no key provided to $t()');
	if (!selectedLanguage) throw new Error(`no translation for key "${key}"`);

	// Grab the translation from the translations object.
	// Fix: Add type safety for dynamic key access
	const langTranslations = translations[selectedLanguage];
	if (!langTranslations) {
		throw new Error(`No translations found for language "${selectedLanguage}"`);
	}

	let text = langTranslations[key as keyof typeof langTranslations];
	if (!text) throw new Error(`no translation found for ${selectedLanguage}.${key}`);

	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const t = derived(
	selectedLanguage,
	($selectedLanguage) =>
		(key: string, vars = {}) =>
			translate($selectedLanguage, key, vars)
);
