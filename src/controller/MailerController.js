/**
 Filename: MailerController.js
 Author  : agache
 Date    : 22/09/2020
 **/
class MailerController {
    handler = require('./../handler/MailHandler');
    MailHandler = new this.handler();
    sendMail(nodemailer)
    {
        new this.MailHandler.sendMailsBulk(nodemailer);
    }
}