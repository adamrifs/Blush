const { sendEmail } = require("../config/emailSender");
const { baseTemplate, orderTable } = require("../utils/emailTemplates");

exports.sendNewOrderEmail = async (to, order) => {
  const html = baseTemplate({
    title: "🛒 New Order Received",
    content: `
      <p>A new order has been placed.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      ${orderTable(order)}
    `
  });

  await sendEmail(to, `New Order #${order._id}`, html);
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
