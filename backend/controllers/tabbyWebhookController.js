const axios = require("axios");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const { notifyAdmins } = require("../services/orderNotifications");
const OrderNotification = require('../models/OrderNotification')

exports.handleTabbyWebhook = async (req, res) => {
  try {
    if (req.body.type !== "payment.authorized") {
      return res.status(200).send("Ignored");
    }

    const paymentId = req.body.data.id;

    // 1️⃣ VERIFY
    const verifyRes = await axios.get(
      `https://api.tabby.ai/api/v2/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
        },
      }
    );

    const payment = verifyRes.data;

    if (payment.status !== "AUTHORIZED") {
      return res.status(400).send("Not authorized");
    }

    // 2️⃣ FIND ORDER
    const orderId = payment.order.reference_id;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).send("Order not found");

    if (order.payment.status === "paid") {
      return res.status(200).send("Already processed");
    }

    // 3️⃣ CAPTURE
    await axios.post(
      `https://api.tabby.ai/api/v2/payments/${paymentId}/capture`,
      { amount: payment.amount.amount },
      {
        headers: {
          Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
        },
      }
    );

    // 4️⃣ FINALIZE ORDER
    order.payment.status = "paid";
    order.status = "processing";
    order.payment.transactionId = paymentId;
    order.payment.amount = payment.amount.amount;

    await order.save();

    // 5️⃣ NOTIFICATIONS + CART CLEANUP
    await notifyAdmins(order, req.app);
    await Cart.deleteMany({ userId: order.userId });

    res.status(200).send("Order completed");

  } catch (err) {
    console.error("Tabby webhook error:", err);
    res.status(500).send("Webhook failed");
  }
};
