import fetch from 'node-fetch';
import { selectedLanguage } from '$lib/sharedStore';


export async function handle({ event, resolve }) {

    const ip = event.getClientAddress();
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
    const data = await res.json();

    if (data.status === 'success') {
        const lang = data.countryCode === 'SE' ? 'sv' : 'en';
        selectedLanguage.set(lang);
    } else {
        selectedLanguage.set("sv"); // Default swedish language
    }

    return await resolve(event);
}
