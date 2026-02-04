const { sendEmail } = require("../config/emailSender");
const { baseTemplate, orderTable, orderPlacedContent } = require("../utils/emailTemplates");

exports.sendNewOrderEmail = async (to, order) => {
  const html = baseTemplate({
    title: `🛒 New Order #${order._id}`,
    content: orderPlacedContent(order)
  });

  try {
    await sendEmail(to, `New Order #${order._id}`, html);
  } catch (err) {
    console.error("EMAIL FAILED:", err.message);
  }
};



exports.sendOrderCancelledEmail = async (to, order) => {
  const html = baseTemplate({
    title: "❌ Order Cancelled",
    content: `
      <p>The following order has been cancelled.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
    `
  });

  await sendEmail(to, `Order Cancelled #${order._id}`, html);
};

exports.sendPaymentFailedEmail = async (to, order) => {
  const html = baseTemplate({
    title: "⚠️ Payment Failed",
    content: `
      <p>Payment failed for the order below.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p>Please check payment logs.</p>
    `
  });

  await sendEmail(to, `Payment Failed #${order._id}`, html);
};
