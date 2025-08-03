import { createClient, type Provider } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { toast } from 'svelte-sonner';
import { browser } from '$app/environment';

function createSupabaseClient() {
	if (browser) {
		return createClient(
			PUBLIC_SUPABASE_URL.trim(),
			PUBLIC_SUPABASE_ANON_KEY.replace(/[\r\n]+/g, '').trim()
		);
	}
	return null;
}

let supabase = createSupabaseClient();
if (browser && !supabase) {
	supabase = createSupabaseClient();
}

async function getUserId(): Promise<string> {
	if (!browser || !supabase) {
		console.warn('Supabase client not available');
		return '';
	}

	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		return user?.id || '';
	} catch (error) {
		console.error('Error getting user ID:', error);
		return '';
	}
}

async function isLoggedIn(): Promise<boolean> {
	if (!browser || !supabase) {
		return false;
	}

	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		return user !== null && user !== undefined;
	} catch (error) {
		console.error('Error checking login status:', error);
		return false;
	}
}

async function signUp(
	email: string,
	password: string,
	isPremium: boolean = false
): Promise<boolean> {
	if (!browser || !supabase) {
		toast.error('Authentication not available');
		return false;
	}

	let params = {};
	if (isPremium) {
		params = {
			credits: 500,
			subscription_expiration_date: Date.now().toString()
		};
	} else {
		params = {
			credits: 5
		};
	}

	try {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: params
			}
		});

		if (error) {
			toast.error(error.message);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Error during signup:', error);
		toast.error('An error occurred during signup');
		return false;
	}
}

async function signInWithPassword(email: string, password: string): Promise<boolean> {
	if (!browser || !supabase) {
		toast.error('Authentication not available');
		return false;
	}

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});
		if (!error) {
			toast.success('Login successful');
			return true;
		} else {
			toast.error(error.message);
			return false;
		}
	} catch (error) {
		console.error('Error during login:', error);
		toast.error('An error occurred during login');
		return false;
	}
}

async function signInWithOAuth(provider: Provider = 'google') {
	if (!browser || !supabase) {
		toast.error('Authentication not available');
		return;
	}

	try {
		console.log(`Started login with provider: ${provider}`);
		const { error } = await supabase.auth.signInWithOAuth({ provider: provider });

		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Login successful');
		}
	} catch (error) {
		console.error('Error during OAuth login:', error);
		toast.error('An error occurred during login');
	}
}

async function resetPasswordForEmail(email: string) {
	if (!browser || !supabase) {
		toast.error('Authentication not available');
		return;
	}

	try {
		const { error } = await supabase.auth.resetPasswordForEmail(email);

		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Check your email to reset your password.');
		}
	} catch (error) {
		console.error('Error resetting password:', error);
		toast.error('An error occurred while resetting password');
	}
}

async function updateEmail(email: string): Promise<boolean> {
	if (!browser || !supabase) {
		toast.error('Authentication not available');
		return false;
	}

	try {
		const { error } = await supabase.auth.updateUser({
			email: email
		});

		if (error) {
			toast.error(error.message);
			return false;
		}

		toast.success('Email updated successfully');
		return true;
	} catch (error) {
		console.error('Error updating email:', error);
		toast.error('An error occurred while updating email');
		return false;
	}
}

async function signOut() {
	if (!browser || !supabase) {
		return;
	}

	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			toast.error(error.message);
		} else {
			toast.info('You have been signed out');
		}
	} catch (error) {
		console.error('Error during sign out:', error);
		toast.error('An error occurred during sign out');
	}
}

async function getUser() {
	if (!browser || !supabase) {
		toast.error('Authentication not available');
		return;
	}

	return await supabase.auth.getUser();
}

async function getUserEmail() {
	const userResponse = await getUser();
	const user = userResponse?.data?.user;
	return user?.email || '';
}

export {
	supabase,
	signUp,
	signInWithPassword,
	signInWithOAuth,
	signOut,
	resetPasswordForEmail,
	isLoggedIn,
	getUserId,
	updateEmail,
	getUser,
	getUserEmail
};
