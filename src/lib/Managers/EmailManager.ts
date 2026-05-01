// src/lib/server/emailManager.ts
import { env } from '$env/dynamic/private';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'Instafication <no-reply@transactional.instafication.shop>';
const RESEND_API_KEY = env.RESEND_API_KEY;

type Recipient = string | string[];

interface SendParams {
	to: Recipient;
	subject: string;
	html: string;
}

/**
 * Low-level Resend POST using fetch.
 * Returns true on 2xx; logs and returns false otherwise.
 */
async function sendViaResend({ to, subject, html }: SendParams): Promise<boolean> {
	if (!RESEND_API_KEY) {
		console.error('[EmailManager] RESEND_API_KEY is missing; cannot send email.');
		return false;
	}

	try {
		const res = await fetch(RESEND_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${RESEND_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: FROM_ADDRESS,
				to,
				subject,
				html
			})
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			console.error(
				`[EmailManager] Resend error ${res.status} ${res.statusText}: ${text || '<no body>'}`
			);
			return false;
		}

		// Optionally inspect JSON for id, etc.
		// const data = await res.json().catch(() => null);
		return true;
	} catch (err) {
		console.error('[EmailManager] Network/Fetch error:', err);
		return false;
	}
}

async function SendEmailWhenSubscriptionProlonged(
	to: string,
	subject: string,
	body: string
): Promise<boolean> {
	try {
		return await sendViaResend({ to, subject, html: body });
	} catch (err) {
		console.error(`[EmailManager] Error sending 'subscription prolonged' email:`, err);
		return false;
	}
}

async function SendEmailWhenUserIsCreated(
	to: string,
	subject: string,
	body: string
): Promise<boolean> {
	try {
		return await sendViaResend({ to, subject, html: body });
	} catch (err) {
		console.error(`[EmailManager] Error sending 'user created' email:`, err);
		return false;
	}
}

async function SendEmailWhenSubscription(to: string): Promise<boolean> {
	try {
		return await sendViaResend({
			to,
			subject: 'Välkommen till Instafication Premium!',
			html: 'Välkommen till Instafication Premium!'
		});
	} catch (err) {
		console.error(`[EmailManager] Error sending 'subscription welcome' email:`, err);
		return false;
	}
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
	console.log('[EmailManager -> sendEmail()]: Called');
	try {
		return await sendViaResend({ to, subject, html });
	} catch (err) {
		console.error('[EmailManager] Error sending generic email:', err);
		return false;
	}
}

async function sendLaundryNotification(
	to: string,
	area: string,
	date: string,
	time: string
): Promise<boolean> {
	const subject = `🚀 Ny tvättid hittad – ${date} ${time}`;
	const html = `
	<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
		<div style="text-align: center; background-color: #4F46E5; padding: 20px; border-radius: 10px 10px 0 0;">
			<h1 style="color: white; margin: 0;">Ny Tvättid Tillgänglig!</h1>
		</div>
		<div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
			<h2 style="color: #1F2937;">Hej!</h2>
			<p>Vi har hittat en ny tvättid i <strong>${area}</strong> som matchar dina inställningar.</p>
			<div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
				<h3 style="color: #1F2937; margin-top: 0;">Tvättinformation</h3>
				<p><strong>Datum:</strong> ${date}</p>
				<p><strong>Tid:</strong> ${time}</p>
				<p><strong>Område:</strong> ${area}</p>
			</div>
			<p>För att boka denna tid, logga in på SSSB:s hemsida:</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="https://sssb.aptustotal.se/AptusPortal/Account/Login"
				   style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
					Gå till SSSB
				</a>
			</div>
			<p style="color: #6B7280; font-size: 14px;">
				<strong>OBS!</strong> Denna tid kan redan vara bokad av någon annan.
				Logga in snabbt för att säkra din plats.
			</p>
			<p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
				Tack för att du använder Instafication!<br>
				/ Teamet bakom Instafication
			</p>
		</div>
		<div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
			<p>Du får detta meddelande eftersom du har aktiverat e-postnotiser för tvättider i ${area}.</p>
			<p>© ${new Date().getFullYear()} Instafication. Alla rättigheter förbehållna.</p>
		</div>
	</div>
	`;

	try {
		const ok = await sendViaResend({ to, subject, html });
		if (ok) {
			console.log(`[EmailManager] Laundry notification sent to ${to} (${area} - ${date} ${time})`);
		}
		return ok;
	} catch (err) {
		console.error('[EmailManager] Error sending laundry notification email:', err);
		return false;
	}
}

export {
	SendEmailWhenSubscription,
	SendEmailWhenSubscriptionProlonged,
	SendEmailWhenUserIsCreated,
	sendEmail,
	sendLaundryNotification
};
