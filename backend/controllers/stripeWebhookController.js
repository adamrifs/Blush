const Stripe = require("stripe");
const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const { notifyAdmins } = require("../services/orderNotifications");
const OrderNotification = require("../models/OrderNotification");
const AdminSettings = require("../models/AdminSettings");
const User = require("../models/userSchema");
const { sendNewOrderEmail, sendOrderConfirmationToCustomer } = require("../services/notificationEmails");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================================
   CREATE ORDER FROM STRIPE SESSION
====================================== */
async function createOrderFromSession(session, req) {

  // Prevent duplicate orders
  const existingOrder = await Order.findOne({
    "payment.transactionId": session.payment_intent,
  });

  if (existingOrder) {
    console.log("⚠️ Order already exists for session:", session.id);
    return;
  }

  console.log("🧾 Creating order from session:", session.id);

  const items = JSON.parse(session.metadata.cart).map((item) => ({
    productId: new mongoose.Types.ObjectId(item.productId),
    quantity: item.quantity,
    addons: item.addons || [],
  }));

  const order = new Order({
    userId: session.metadata.userId,

    sender: {
      name: session.metadata.senderName,
      phone: session.metadata.senderPhone,
    },

    items,
    shipping: JSON.parse(session.metadata.shipping),

    payment: {
      method: "card",
      status: "paid",
      transactionId: session.payment_intent,
      orderId: session.id,
      amount: session.amount_total / 100,
      vat: JSON.parse(session.metadata.totals).vatAmount,
    },

    totals: JSON.parse(session.metadata.totals),
    cardMessage: {
      option: session.metadata.cardOption,
      messageText: session.metadata.cardText,
      template: session.metadata.cardTemplate,
    },
  });

  await order.save();

  await order.populate("items.productId");

  const adminSettingsList = await AdminSettings.find({});

  for (const settings of adminSettingsList) {
    if (settings.emailEnabled && settings.email) {
      await sendNewOrderEmail(settings.email, order);
    }
  }

  const user = await User.findById(order.userId);

  if (user?.email) {
    await sendOrderConfirmationToCustomer(user.email, order);
  }

  console.log("🟢 Stripe order created:", order._id);

  await OrderNotification.create({
    title: "New Order Received",
    message: `Order #${order._id} has been placed`,
  });

  await notifyAdmins(order, req.app);
}

/* ======================================
   STRIPE WEBHOOK HANDLER
====================================== */
exports.handleStripeWebhook = async (req, res) => {

  console.log("🔥 STRIPE WEBHOOK HIT");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // RAW BODY
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe event verified:", event.type);

  try {

    /* ===============================
       CHECKOUT COMPLETED
    =============================== */
    if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      await createOrderFromSession(session, req);
    }

  } catch (error) {

    console.error("❌ Webhook processing error:", error);

  }

  // Stripe requires 200 response
  res.json({ received: true });
};