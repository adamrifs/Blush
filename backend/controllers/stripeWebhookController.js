const Stripe = require("stripe");
const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const { notifyAdmins } = require("../services/orderNotifications");
const OrderNotification = require('../models/OrderNotification')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
  console.log("🔥 STRIPE WEBHOOK HIT");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // RAW BUFFER (important)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe event verified:", event.type);

  // ✅ PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // 🛑 PREVENT DUPLICATE ORDERS (Stripe retries webhooks)
    const existingOrder = await Order.findOne({
      "payment.orderId": session.id,
    });

    if (existingOrder) {
      console.log("⚠️ Order already exists for session:", session.id);
      return res.json({ received: true });
    }

    // 🔄 BUILD ITEMS
    const items = JSON.parse(session.metadata.cart).map(item => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
      addons: item.addons || [],
    }));

    // 🧾 CREATE ORDER (ONLY HERE)
    const order = new Order({
      userId: session.metadata.userId,

      // ✅ ADD SENDER
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
      cardMessage: JSON.parse(session.metadata.cardMessage),
    });

    await order.save();
    console.log("🟢 Stripe order created:", order._id);

    await OrderNotification.create({
      title: 'New Order Received',
      message: `Order #${order._id} has been placed`
    });

    // 🔔 NOTIFY ADMINS (socket + email + push)
    await notifyAdmins(order, req.app);
  }

  // ✅ Stripe requires 200 OK
  res.json({ received: true });
};
