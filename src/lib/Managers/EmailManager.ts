
const API_URL = 'https://api.sendinblue.com/v3/smtp/email';

async function SendEmailWhenUserIsCreated(to: string, body: string): Promise<boolean> {
    const requestBody = JSON.stringify({
        to: [{ email: to, name: "Blinksms" }],
        // sender: { "name": "Blinksms", "email": "Blinksms <hej@blinksms.se>" },
        templateId: 9,
        params: {
            "message": body,
        },
    });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "api-key": "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",
            },
            body: requestBody,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                `[Emailmanager, -] Error sending email: ${response.status} ${response.statusText}\n\n${errorText}`,
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error('[Emailmanager, -] Error sending email:', error.message);
        return false;
    }
}

async function sendEmail(
    to: string,
    body: string,
): Promise<boolean> {
    const requestBody = JSON.stringify({
        to: [{ email: to, name: "Blinksms" }],
        // sender: { "name": "Blinksms", "email": "Blinksms <hej@blinksms.se>" },
        templateId: 7,
        params: {
            "message": body,
        },
    });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "api-key": "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",
            },
            body: requestBody,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                `[Emailmanager, -] Error sending email: ${response.status} ${response.statusText}\n\n${errorText}`,
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error('[Emailmanager, -] Error sending email:', error.message);
        return false;
    }
}

export { SendEmailWhenUserIsCreated, sendEmail };