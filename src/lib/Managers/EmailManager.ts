export class EmailManager {

    // src/lib/emailManager.ts
 public static async sendEmail(title: string, body: string) {
    const send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: 'martin.pa.jakobsson@icloud.com', name: 'Martin Jakobsson' }],
                },
            ],
            from: {
                email: 'hej@blinksms.se',
                name: 'Blinksms.se',
            },
            subject: title,
            content: [
                {
                    type: 'text/plain',
                    value: body,
                },
            ],
        }),
    });

    const resp = await fetch(send_request);
    const respText = await resp.text();
    let respContent = resp.status + ' ' + resp.statusText + '\n\n' + respText;
}
}