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
	return session?.data?.user?.id ?? '';
}

export async function getUserEmail(): Promise<string> {
	const session = await getSession();
	return session?.data?.user?.email ?? '';
}

export async function isLoggedIn(): Promise<boolean> {
	const session = await getSession();
	return Boolean(session?.data?.user);
}

export async function signUp(email: string, password: string, _isPremium: boolean = false): Promise<boolean> {
	if (!browser) {
		toast.error('Authentication not available');
		return false;
	}

	try {
		console.log('[AuthManager] signUp request', { email, hasPassword: Boolean(password) });
		const res = await client.signUp?.email?.({ email, password, rememberMe: true });
		console.log('[AuthManager] signUp response', res);
		if (res?.error) {
			console.error('[AuthManager] signUp error', res.error);
			const msg = res.error.message || 'Could not sign up';
			const code = (res.error as any)?.code;
			toast.error(code ? `${msg} (${code})` : msg);
			return false;
		}
		userLoggedIn.set(true);
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
		console.log('[AuthManager] signIn request', { email, hasPassword: Boolean(password) });
		const res = await client.signIn?.email?.({ email, password, rememberMe: true });
		console.log('[AuthManager] signIn response', res);
		if (res?.error) {
			console.error('[AuthManager] signIn error', res.error);
			const msg = res.error.message || 'Invalid credentials';
			const code = (res.error as any)?.code;
			toast.error(code ? `${msg} (${code})` : msg);
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
	if (!browser) {
		toast.error('Authentication not available');
		return;
	}

	try {
		await (client as any).requestPasswordReset?.({
			email: _email,
			redirectTo: `${location.origin}/reset-password`
		});
		toast.success('Ett mail med återställningslänk har skickats om adressen finns hos oss');
		return true;
	} catch (error) {
		console.error('Error requesting password reset:', error);
		toast.error('Kunde inte skicka återställningslänk');
		return false;
	}
}

export async function updateEmail(_email: string): Promise<boolean> {
	if (!browser) {
		toast.error('Authentication not available');
		return false;
	}

	try {
		if (!_email || !_email.includes('@')) {
			toast.error('Ogiltig e‑postadress');
			return false;
		}

		// Determine whether current email is verified; if not, change happens immediately
		const currentSession = await getSession();
		const isCurrentlyVerified = Boolean(currentSession?.user?.emailVerified);

		const res = await client.changeEmail?.({
			newEmail: _email,
			callbackURL: `${location.origin}/?email-change=done`
		});

		if (res?.error) {
			console.error('[AuthManager] changeEmail error', res.error);
			const msg = res.error.message || 'Kunde inte ändra e‑post';
			const code = (res.error as any)?.code;
			toast.error(code ? `${msg} (${code})` : msg);
			return false;
		}

		if (isCurrentlyVerified) {
			toast.info('Vi har skickat en bekräftelselänk till din nuvarande e‑post. Följ länken för att slutföra ändringen.');
		} else {
			// For unverified accounts, the change is immediate
			toast.success('Din e‑post har uppdaterats.');
		}
		return true;
	} catch (error) {
		console.error('Error changing email:', error);
		toast.error('Ett fel uppstod vid ändring av e‑post');
		return false;
	}
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
