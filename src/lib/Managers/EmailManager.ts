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
            from: 'Instafication <no-reply@instafication.shop>',
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
            from: 'Instafication <no-reply@instafication.shop>',
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
            from: 'Instafication <no-reply@instafication.shop>',
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
    body: string
): Promise<boolean> {
    try {
        await resend.emails.send({
            from: 'Instafication <no-reply@instafication.shop>',
            to,
            subject: 'Välkommen till Instafication Premium!',
            html: body
        });
        return true;
    } catch (err: any) {
        console.error(`[Emailmanager] Error sending generic email:`, err);
        return false;
    }
}

export {
    SendEmailWhenUserIsCreated,
    sendEmail,
    SendEmailWhenSubscription,
    SendEmailWhenSubscriptionProlonged,
};
