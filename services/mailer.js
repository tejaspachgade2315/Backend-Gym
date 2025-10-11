const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendRegistrationEmail = async (recipentEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipentEmail,
            subject: "Welcome to our Gym",
            html: `
            <h1>Hello ${userName},</h1>
            <p>Thank you for registering with us. We are excited to have you on board.</p>
            <p>Best regards,<br>The Gym Team</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendRegistrationEmail
}