const nodemailer = require("nodemailer");

async function sendEmail(options) {
  // 1. Create a transporter
  // Transporter is a service that will send email.
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email options
  const emailOptions = {
    from: "Shrinivas Kenjale <shri@natours.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3. Send the email with nodemailer
  await transport.sendMail(emailOptions);
}

module.exports = sendEmail;
