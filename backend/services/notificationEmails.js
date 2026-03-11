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

exports.sendOrderConfirmationToCustomer = async (to, order) => {
  const html = baseTemplate({
    title: "💐 Your Blush Order is Confirmed",
    content: `
      <p style="font-size:15px;">
        Thank you for choosing <strong>Blush Flowers</strong>. Your order has been received successfully and is now being prepared with care.
      </p>

      <p style="margin-top:16px;">
        <strong>Order #${order._id}</strong><br/>
        Payment Method: ${order.payment.method.toUpperCase()}<br/>
        Payment Status: ${order.payment.status}
      </p>

      ${orderTable(order)}

      <p style="margin-top:14px">
        <strong>Delivery Date:</strong>
        ${new Date(order.shipping.deliveryDate).toDateString()}<br/>

        <strong>Delivery Slot:</strong>
        ${order.shipping.deliverySlot?.title || "N/A"}
        ${order.shipping.deliverySlot?.time ? ` (${order.shipping.deliverySlot.time})` : ""}
      </p>

      <div class="row">
        <div class="box">
          <div class="label">Receiver Details</div>
          ${order.shipping.receiverName}<br/>
          ${order.shipping.receiverPhone}<br/>
          ${order.shipping.area}, ${order.shipping.emirate}
        </div>

        <div class="box">
          <div class="label">Order Summary</div>
          Total: AED ${Number(order.totals?.grandTotal || 0).toFixed(2)}<br/>
          Status: ${order.status}
        </div>
      </div>

      ${order.cardMessage?.message
        ? `
          <div style="margin-top:20px;padding:14px;background:#1b1b1b;border-radius:6px;">
            <div class="label">Card Message</div>
            ${order.cardMessage.message}
          </div>
        `
        : ""
      }

      <p style="margin-top:24px;font-size:14px;">
        We’ll notify you once your order is out for delivery.
      </p>

      <p style="margin-top:20px;">
        Thank you for trusting Blush Flowers 🌸
      </p>
    `
  });

  try {
    await sendEmail(to, `Order Confirmation #${order._id}`, html);
  } catch (err) {
    console.error("Customer Email Failed:", err.message);
  }
};