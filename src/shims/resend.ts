export class Resend {
    constructor(_apiKey?: string) {}
    emails = {
        send: async (_args: any) => {
            return { id: 'stubbed-email', success: true };
        }
    };
}


