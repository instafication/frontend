/**
 * Email Service - Handles all transactional emails via Resend
 */

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

export interface EmailServiceConfig {
	apiKey: string;
	/** Use fallback sender for local dev (onboarding@resend.dev) */
	isLocal?: boolean;
}

const PREFERRED_FROM = 'Instafication <no-reply@transactional.instafication.shop>';
const FALLBACK_FROM = 'Instafication <onboarding@resend.dev>';
const RESEND_API_URL = 'https://api.resend.com/emails';

export interface EmailResult {
	success: boolean;
	id?: string;
	error?: string;
}

/**
 * Send an email via Resend API
 */
export async function sendEmail(
	options: EmailOptions,
	config: EmailServiceConfig
): Promise<EmailResult> {
	const { to, subject, html } = options;
	const { apiKey, isLocal = false } = config;

	if (!apiKey) {
		console.error('[EmailService] API key is missing');
		return { success: false, error: 'API key missing' };
	}

	const _from = isLocal ? FALLBACK_FROM : PREFERRED_FROM;

	const sendRequest = async (sender: string): Promise<EmailResult> => {
		console.log('[EmailService] Sending email', { from: sender, to });

		// Create abort controller with 30 second timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30_000);

		try {
			const response = await fetch(RESEND_API_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ from: sender, to, subject, html }),
				signal: controller.signal
			});

			const text = await response.text();
			let json: { id?: string; error?: string } | null = null;

			try {
				json = JSON.parse(text);
			} catch {}

			console.log('[EmailService] Response', {
				status: response.status,
				ok: response.ok,
				id: json?.id ?? null,
				error: json?.error ?? null
			});

			if (!response.ok) {
				return { success: false, error: json?.error ?? `HTTP ${response.status}` };
			}

			return { success: true, id: json?.id };
		} finally {
			clearTimeout(timeoutId);
		}
	};

	try {
		// In local dev, use fallback sender directly
		if (isLocal) {
			return await sendRequest(FALLBACK_FROM);
		}

		// In production, try preferred sender first, then fallback
		try {
			return await sendRequest(PREFERRED_FROM);
		} catch (e) {
			console.warn('[EmailService] Preferred sender failed, trying fallback', e);
			return await sendRequest(FALLBACK_FROM);
		}
	} catch (e) {
		const error = e instanceof Error ? e.message : String(e);
		console.error('[EmailService] Failed to send email', error);
		return { success: false, error };
	}
}

/**
 * Email templates for common transactional emails
 */
export const EmailTemplates = {
	resetPassword: (resetUrl: string) => ({
		subject: 'Återställ ditt lösenord',
		html: `
			<p>Hej!</p>
			<p>Du har begärt att återställa ditt lösenord hos Instafication.</p>
			<p>Klicka på länken nedan för att återställa ditt lösenord:</p>
			<p><a href="${resetUrl}">${resetUrl}</a></p>
			<p>Om du inte begärt denna åtgärd kan du ignorera detta mail.</p>
		`
	}),

	changeEmail: (newEmail: string, verifyUrl: string) => ({
		subject: 'Bekräfta ändring av e-post',
		html: `
			<p>Hej!</p>
			<p>Du har begärt att ändra din e-post till <strong>${newEmail}</strong>.</p>
			<p>Klicka på länken nedan för att bekräfta ändringen:</p>
			<p><a href="${verifyUrl}">${verifyUrl}</a></p>
			<p>Om du inte begärt denna ändring kan du ignorera detta mail.</p>
		`
	}),

	welcome: (email: string) => ({
		subject: 'Välkommen till Instafication! 🎉',
		html: `
			<p>Välkommen till Instafication!</p>
			<p>Ditt konto har skapats med e-postadressen: <strong>${email}</strong></p>
			<p>Du kan nu logga in och börja använda tjänsten.</p>
		`
	}),

	subscriptionProlonged: () => ({
		subject: 'Instafication – Din prenumeration är nu förlängd! 🎉',
		html: `
			<p>Hej!</p>
			<p>Din prenumeration har nu förlängts med 30 dagar!</p>
		`
	}),

	creditsRefilled: (amount: number) => ({
		subject: 'Instafication – Ditt konto har laddats på! 💰',
		html: `
			<p>Hej!</p>
			<p>Ditt konto har nu laddats på med ${amount} krediter som du direkt kan använda för notifikationer.</p>
		`
	})
};

/**
 * Helper to detect if running in local dev environment
 */
export function isLocalEnvironment(url: string): boolean {
	try {
		const hostname = new URL(url).hostname;
		return /localhost|127\./.test(hostname);
	} catch {
		return false;
	}
}
