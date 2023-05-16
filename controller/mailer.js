const nodemailer = require('nodemailer');
require('dotenv').config()

exports.SendGeneratedOTPCode = (to, otp ,text,subject) =>
{
    return new Promise((resolve, reject) =>
    {
        const transporter = nodemailer.createTransport 
        ({
            // service: 'Gmail', // replace with your email service provider
            port : 465,    // -> True for 465, false for other ports
            host : "smtp.gmail.com",
            auth :
            {
                user : process.env.EMAIL, // replace with your email address
                pass : process.env.EMAIL_PWD // replace with your email password
            },
            secure : true,  
        }); 

        const mailOptions = 
        {
            from : process.env.EMAIL, // replace with your email address
            to : to, // recipient's email address
            subject : subject,
            text : text
        };
        
        transporter.sendMail(mailOptions, (error, info) => 
        {
            if(error)
            {
                // console.error('Error sending email:', error);
                reject(error); // Reject the promise with the error
            }
            else
            {
                console.log("haiii");
                // console.log('Email sent:', info.response);
                resolve(info.response); // Resolve the promise with the email response
            }
        });
    });
};             