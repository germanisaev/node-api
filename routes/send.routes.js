//var express = require('express');
//var router = express.Router();
const { authJwt } = require("../middleware");
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Vonage = require('@vonage/server-sdk');
const secret = require('../config/vonage.config');
const smtp = require('../config/smtp.config');


module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;

    const vonage = new Vonage({
        apiKey: secret.apiKey,
        apiSecret: secret.apiSecret
    });

    /*
    * POST to Verification Code Request.
    */

    app.post('/api/v1/otp', function (req, res) {

        if (typeof param === 'undefined') {
            return null;
        }
        else {
            if (validateEmail(`${req.body.email}`)) {
                // email is valid
                sendEmail(req)
            }
            else {
                if (validatePhone(`${req.body.phone}`)) {
                    // is number
                    sendSMS(req)
                }
                else {
                    return false;
                }
            }
        }

    });


    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function hasDecimal(num) {
        return !!(num % 1);
    }

    function validatePhone(phone) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        console.log(regex.test(phone))
    }

    function sendSMS(req) {
        const from = "SwanDuo"
        const to = `${req.body.phone}` //"972549452396"//"972526997868" //"972549452396"
        const text = `Your One-Time-Password is ${OTP}`
        const opts = {
            "type": "unicode"
        }

        vonage.message.sendSms(from, to, text, opts, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        });
    }

    function sendEmail(req) {
        const time = `${req.body.time}`;
        const counter = `${req.body.counter}`;

        const options = smtp;

        //console.log(options);

        const transporter = nodemailer.createTransport(smtpTransport(options));

        const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
          <li>First Name: ${req.body.first_name}</li>
          <li>Last Name: ${req.body.last_name}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>Your One-Time-Password is ${OTP}</p>
        <p>You sent In ${counter} times</p>
        <p>You have only ${time} seconds by resend verification code.</p>
      `;

        // create reusable transporter object using the default SMTP transport
        /* let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // 587 
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'german.isaev@gmail.com', // generated ethereal user
                pass: '5A3Cbd44'  // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        }); */

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nodemailer Contact" <norepeat@email.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Node Contact Request', // Subject line
            //text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', { msg: 'Email has been sent' });
        });
    }







    app.post('/api/v1/sms', function (req, res) {

        /* const min = Math.ceil(1000);
        const max = Math.floor(9999);
        const OTP = Math.floor(Math.random() * (max - min + 1)) + min; */

        //const time = `${req.body.time}`;
        //const counter = `${req.body.counter}`;

        const from = "SwanDuo"
        const to = `${req.body.phone}` //"972549452396"//"972526997868" //"972549452396"
        const text = `Your One-Time-Password is ${OTP}`
        const opts = {
            "type": "unicode"
        }

        vonage.message.sendSms(from, to, text, opts, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        });
    });


    app.post('/api/v1/email', function (req, res) { // authJwt.verifyToken,
        // create reusable transporter object using SMTP transport
        /* const min = Math.ceil(1000);
        const max = Math.floor(9999);
        const OTP = Math.floor(Math.random() * (max - min + 1)) + min; */

        const time = `${req.body.time}`;
        const counter = `${req.body.counter}`;

        const options = smtp;

        //console.log(options);

        const transporter = nodemailer.createTransport(smtpTransport(options));

        const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
          <li>First Name: ${req.body.first_name}</li>
          <li>Last Name: ${req.body.last_name}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>Your One-Time-Password is ${OTP}</p>
        <p>You sent In ${counter} times</p>
        <p>You have only ${time} seconds by resend verification code.</p>
      `;

        // create reusable transporter object using the default SMTP transport
        /* let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // 587 
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'german.isaev@gmail.com', // generated ethereal user
                pass: '5A3Cbd44'  // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        }); */

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nodemailer Contact" <norepeat@email.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Node Contact Request', // Subject line
            //text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', { msg: 'Email has been sent' });
        });

    });
}

/*
 * POST to addcoupon Request.
 */


