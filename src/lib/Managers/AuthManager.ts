import { browser } from '$app/environment';
import { toast } from 'svelte-sonner';
import authClient from '$lib/authClient';
import { userLoggedIn } from '$lib/sharedStore';

type AnyAuthClient = any;
const client: AnyAuthClient = authClient as AnyAuthClient;

async function getSession(): Promise<any | null> {
	if (!browser) return null;
	try {
		return await client.getSession?.();
	} catch (error) {
		console.error('Error getting session:', error);
		return null;
	}
}

export async function getUserId(): Promise<string> {
	const session = await getSession();
	return session?.user?.id ?? '';
}

export async function getUserEmail(): Promise<string> {
	const session = await getSession();
	return session?.user?.email ?? '';
}

export async function isLoggedIn(): Promise<boolean> {
	const session = await getSession();
	return Boolean(session?.user);
}

export async function signUp(email: string, password: string, _isPremium: boolean = false): Promise<boolean> {
	if (!browser) {
		toast.error('Authentication not available');
		return false;
	}

	try {
		const res = await client.signUp?.email?.({ email, password });
		if (res?.error) {
			toast.error(res.error.message || 'Could not sign up');
			return false;
		}
		toast.success('Account created');
		return true;
	} catch (error) {
		console.error('Error during signup:', error);
		toast.error('An error occurred during signup');
		return false;
	}
}

export async function signInWithPassword(email: string, password: string): Promise<boolean> {
	if (!browser) {
		toast.error('Authentication not available');
		return false;
	}

	try {
		const res = await client.signIn?.email?.({ email, password });
		if (res?.error) {
			toast.error(res.error.message || 'Invalid credentials');
			return false;
		}
		userLoggedIn.set(true);
		toast.success('Login successful');
		return true;
	} catch (error) {
		console.error('Error during login:', error);
		toast.error('An error occurred during login');
		return false;
	}
}

export async function signInWithOAuth(_provider: string = 'google') {
	toast.error('OAuth sign-in not configured');
}

export async function resetPasswordForEmail(_email: string) {
	toast.error('Password reset is not configured');
}

export async function updateEmail(_email: string): Promise<boolean> {
	toast.error('Updating email is not configured');
	return false;
}

export async function signOut() {
	if (!browser) return;
	try {
		await client.signOut?.();
		userLoggedIn.set(false);
		toast.info('You have been signed out');
	} catch (error) {
		console.error('Error during sign out:', error);
		toast.error('An error occurred during sign out');
	}
}

export async function getUser() {
	return await getSession();
}
