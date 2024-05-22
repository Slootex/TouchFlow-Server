import { createRequire } from "module";

const require = createRequire(import.meta.url);
const express = require("express");
const crypto = require('crypto');
var nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');

export class EmailController {

    constructor() {
        this.nodemailer = require('nodemailer');

    }

    async sendEmail(email, subject, code, template) {

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "touchflow.cloud@gmail.com",
              pass: "dhti zhbt blzm znzw",
            },
        });
        
        const message = await ejs.renderFile("emails/"+template+".ejs", { code: code });

        var mailOptions = {
          from: 'touchflow.cloud@gmail.com',
          to: email,
          subject: subject,
          html: message
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

    }

}