const Stripe = require("stripe");
const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const AdminSettings = require("../models/AdminSettings");
const firebaseAdmin = require("../config/firebaseAdmin");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
  console.log("🔥🔥🔥 STRIPE WEBHOOK HIT 🔥🔥🔥");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // ✅ RAW BUFFER
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ EVENT VERIFIED:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const items = JSON.parse(session.metadata.cart).map(item => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
      addons: item.addons || []
    }));

    const order = new Order({
      userId: session.metadata.userId,
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
    console.log("🟢 ORDER SAVED:", order._id);

    // 🔔 SEND ADMIN PUSH NOTIFICATION (RIGHT PLACE)
    const adminSettingsList = await AdminSettings.find({
      pushTokens: { $exists: true, $ne: [] },
    });

    const allPushTokens = adminSettingsList.flatMap(
      settings => settings.pushTokens
    );

    if (allPushTokens.length > 0) {
      const response = await firebaseAdmin.messaging().sendEachForMulticast({
        tokens: allPushTokens,
        data: {
          title: "🛒 New Order Received",
          body: `Order #${order._id} has been placed`,
          type: "order_created",
          orderId: order._id.toString(),
        },
        webpush: {
          headers: {
            TTL: "300",
          },
        },
      });

      console.log("🔥 FCM RESPONSE:", response);

    } else {
      console.log("⚠️ No admin push tokens found");
    }
  }

  // ✅ Stripe MUST receive 200 OK
  res.json({ received: true });
};
