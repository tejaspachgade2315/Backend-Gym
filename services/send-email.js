const nodemailer = require("nodemailer");

const sendEmail = async function (email, password) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Account Password",
    text: `Hello, your account has been created. Use the following password to log in: ${password}`,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
}

module.exports = sendEmail;