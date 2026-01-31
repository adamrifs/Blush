const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // ✅ VERIFY SMTP CONNECTION
  await transporter.verify();
  console.log("✅ Email server is ready");

  const info = await transporter.sendMail({
    from: `"Blush Flowers" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent:", info.messageId);
};

module.exports = sendEmail;
