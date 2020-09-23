/**
 Filename: MailHandler.js
 Author  : agache
 Date    : 22/09/2020
 **/

class MailHandler {

    transporter = null;
    constructor(nodemailer) {
        this.transporter = nodemailer.createTransport();
    }

    async sendMailsBulk()
    {
        console.log(this.transporter.send);
    }
}

module.exports = MailHandler;