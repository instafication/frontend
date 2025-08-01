import { Resend } from 'resend';
import { RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY!);

async function SendEmailWhenSubscriptionProlonged(
    to: string,
    subject: string,
    body: string
): Promise<boolean> {
    try {
        await resend.emails.send({
            from: 'Instafication <no-reply@transactional.instafication.shop>',
            to,
            subject,
            html: body,
        });
        return true;
    } catch (err: any) {
        console.error(
            `[Emailmanager] Error sending 'subscription prolonged' email:`,
            err
        );
        return false;
    }
}

async function SendEmailWhenUserIsCreated(
    to: string,
    subject: string,
    body: string
): Promise<boolean> {
    try {
        await resend.emails.send({
            from: 'Instafication <no-reply@transactional.instafication.shop>',
            to,
            subject,
            html: body,
        });
        return true;
    } catch (err: any) {
        console.error(
            `[Emailmanager] Error sending 'user created' email:`,
            err
        );
        return false;
    }
}

async function SendEmailWhenSubscription(
    to: string,
    /* body param is unused here, so you can omit or repurpose it */
    body: string
): Promise<boolean> {
    try {
        await resend.emails.send({
            from: 'Instafication <no-reply@transactional.instafication.shop>',
            to,
            subject: 'Välkommen till Instafication Premium!',
            html: 'Välkommen till Instafication Premium!'
        });
        return true;
    } catch (err: any) {
        console.error(
            `[Emailmanager] Error sending 'subscription welcome' email:`,
            err
        );
        return false;
    }
}

async function sendEmail(
    to: string,
    subject: string,
    html: string
): Promise<boolean> {
    console.log("[EmailManager -> sendEmail()]: Called")
    try {
        await resend.emails.send({
            from: 'Instafication <no-reply@transactional.instafication.shop>',
            to,
            subject,
            html
        });
        return true;
    } catch (err: any) {
        console.error(`[Emailmanager] Error sending generic email:`, err);
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
        await resend.emails.send({
            from: 'Instafication <no-reply@transactional.instafication.shop>',
            to,
            subject,
            html
        });
        return true;
    } catch (err: any) {
        console.error(`[Emailmanager] Error sending laundry notification email:`, err);
        return false;
    }
}

export {
    SendEmailWhenUserIsCreated,
    sendEmail,
    SendEmailWhenSubscription,
    SendEmailWhenSubscriptionProlonged,
    sendLaundryNotification
};
