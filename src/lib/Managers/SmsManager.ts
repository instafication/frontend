export class SmsManager {

    public static API_USER = 'u5d34425a530f9a86ae52e2a12c96c507';
    public static API_PASS = '74CB5D2E87786F4505546B49282DDA2F';
    public static SMS_FROM = '+46766867379';

    public static async sendSMS(number: string, message: string) {
        const url = 'https://api.46elks.com/a1/SMS';

        const body = new URLSearchParams();
        body.append('from', this.SMS_FROM);
        if (number.toString().startsWith("46")) {
            body.append('to', "+" + number.toString());
        } else {
            body.append('to', "+46" + number.toString());
        }
        body.append('message', message);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(this.API_USER + ':' + this.API_PASS)
            },
            body: body.toString()
        };

        await fetch(url, requestOptions);
    }
}
