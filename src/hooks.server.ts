// import fetch from 'node-fetch';
// import { selectedLanguage } from '$lib/sharedStore';
// // import { COOKIE_LANGUAGE_KEY } from '$lib/constants';



// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({ event, resolve }) {

//     console.log("data");


//     const cookieLanguage = request.cookies["lang"];
//     if (!cookieLanguage) {
//         const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
//         const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
//         const data = await res.json();
//         let lang;


//         if (data.status === 'success') {
//             lang = data.countryCode === 'SE' ? 'sv' : 'en';
//         } else {
//             lang = 'sv'; // Default Swedish language
//         }

//         selectedLanguage.set(lang);
//     } else {
//         selectedLanguage.set(cookieLanguage);
//     }

//     const response = await resolve(request);

//     if (!cookieLanguage) {
//         response.headers['set-cookie'] = `lang=${selectedLanguage}; Path=/; HttpOnly`;
//     }

//     return response;
// }





// import fetch from 'node-fetch';
// import { selectedLanguage } from '$lib/sharedStore';

// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({ event, resolve }) {


//     if (!event.cookies.get("language")) {

//         const ip = event.getClientAddress();
//         const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
//         const data = await res.json();

//         if (data.status === 'success') {
//             const language = data.countryCode === 'SE' ? 'sv' : 'en';
//             selectedLanguage.set(language);
//             event.cookies.set("language", language, { path: "/" })
//         } else {
//             selectedLanguage.set("sv"); // Default swedish language
//             event.cookies.set("language", "sv", { path: "/" })
//         }

//     }

//     const response = await resolve(event);
//     return response;
// } 
