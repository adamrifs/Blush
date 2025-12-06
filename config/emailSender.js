// utils/emailSender.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  try {
    const result = await resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Resend Email Error:", error);
  }
}

module.exports = { sendEmail };
