const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    },
});

const sendMail = (to, subject, text, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: to,
        subject: subject,
        text: text,
        html: htmlContent
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log("Error while sending email: ", error);
        console.log("Email Sent: ", info.response);
    });
}

module.exports = { sendMail }