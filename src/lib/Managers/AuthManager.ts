import { createClient, type Provider } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { SendEmailWhenUserIsCreated } from './EmailManager';


const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

async function getUserId(): Promise<string> {
	const { data: { user } } = await supabase.auth.getUser()
	return user?.id || ""
}

async function isLoggedIn(): Promise<boolean> {
	let userLoggedIn = false;
	let user = await supabase.auth.getUser();
	user = user.data.user;
	console.log(user);
	if (user !== null && user !== undefined) {
		userLoggedIn = true;
	} else {
		userLoggedIn = false;
	}

	return userLoggedIn;
}


async function signUp(email: string, password: string, isPremium: boolean = false): Promise<boolean> {

	let params = {};
	let mailSubject: string = "Välkommen till Instafication! 👋";

	if (isPremium) {
		mailSubject = "Välkommen till Instafication Premium! 👋";
		params = {
			credits: 500,
			subscription_expiration_date: Date.now().toString(),
		};
	} else {
		params = {
			credits: 5,
		};
	}

	console.log(email, password, isPremium);
	console.log(params);

	const { data, error } = await supabase.auth.signUp({
		email: email,
		password: password,
		options: {
			"data": params
		},
	});

	if (error) return false;

	return true;

};

async function signInWithPassword(email: string, password: string) {

	const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
	if (!error) {

		console.log(data.user);
	} else {
		alert(error.message);
	}

}

async function signInWithOAuth(provider: Provider = "google") {
	try {
		console.log(`Started login with provider: ${provider}`);
		const r = await supabase.auth.signInWithOAuth({ provider: provider });
		console.log(`Logged in: ${r}`);
	} catch (error) {
		alert(error);
	}
}

async function resetPasswordForEmail(email: string) {
	try {
		const r = await supabase.auth.resetPasswordForEmail(email);
		alert("Kolla din mail för att återställa lösenordet.");
	} catch (error) {
		console.log(error);
		alert(error);
	}
}

async function signOut() {
	try {
		const r = await supabase.auth.signOut();
		console.log(r);
	} catch (error) {
		console.log(error);
		alert(error);
	}
}	






// let lastAuthStatus = null;
// let lastSession = null;
// supabase.auth.onAuthStateChange((event, session) => {

// 	console.log(event, session);
// 	lastAuthStatus = event;

// 	if (event == 'SIGNED_OUT') {
// 		console.log('SIGNED_OUT', session)
// 	} else if (event == 'SIGNED_IN') {
// 		console.log('SIGNED_IN', session)
// 	} else if (event == 'USER_UPDATED') {
// 		console.log('USER_UPDATED', session)
// 	} else if (event == 'PASSWORD_RECOVERY') {
// 		console.log('PASSWORD_RECOVERY', session)
// 	} else if (event == 'PASSWORD_RESET') {
// 		console.log('PASSWORD_RESET', session)
// 	} else if (event == 'USER_DELETED') {
// 		console.log('USER_DELETED', session)
// 	} else if (event == 'PROFILE_UPDATED') {
// 		console.log('PROFILE_UPDATED', session)
// 	} else if (event == 'EMAIL_VERIFIED') {
// 		console.log('EMAIL_VERIFIED', session)
// 	}

// })


export {
	signUp,
	signInWithPassword,
	signInWithOAuth,
	signOut,
	resetPasswordForEmail,
	isLoggedIn,
	getUserId,
	supabase
};