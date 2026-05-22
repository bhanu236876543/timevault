const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your App Password
    },
  });

  // Define email options
  const mailOptions = {
    from: `TimeVault <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
