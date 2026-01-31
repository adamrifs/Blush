const axios = require("axios");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const { notifyAdmins } = require("../services/orderNotifications");
const OrderNotification = require('../models/OrderNotification')

exports.handleTabbyWebhook = async (req, res) => {
  try {
    console.log("🔥 TABBY WEBHOOK RECEIVED");

    // ✅ Only process authorized payments
    if (req.body.type !== "payment.authorized") {
      return res.status(200).send("Ignored");
    }

    const paymentId = req.body.data.id;

    // 🔐 VERIFY PAYMENT WITH TABBY
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
      return res.status(400).send("Payment not authorized");
    }

    // 🛑 PREVENT DUPLICATE ORDERS
    const existingOrder = await Order.findOne({
      "payment.transactionId": paymentId,
    });

    if (existingOrder) {
      console.log("⚠️ Tabby order already processed:", paymentId);
      return res.status(200).send("Already processed");
    }

    // 💰 CAPTURE PAYMENT
    await axios.post(
      `https://api.tabby.ai/api/v2/payments/${paymentId}/capture`,
      { amount: payment.amount.amount },
      {
        headers: {
          Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
        },
      }
    );

    // 🧾 CREATE ORDER
    const order = new Order({
      userEmail: payment.buyer.email,
      items: payment.order.items.map(item => ({
        name: item.title,
        quantity: item.quantity,
        price: item.unit_price,
      })),
      payment: {
        method: "tabby",
        status: "paid",
        transactionId: paymentId,
        amount: payment.amount.amount,
      },
      totals: {
        grandTotal: payment.amount.amount,
      },
    });

    await order.save();
    console.log("🟢 Tabby order created:", order._id);

    await OrderNotification.create({
      title: 'New Order Received',
      message: `Order #${order._id} has been placed`
    });

    // 🔔 NOTIFY ADMINS
    await notifyAdmins(order, req.app);

    // 🧹 CLEAR CART
    await Cart.deleteMany({ userEmail: payment.buyer.email });

    return res.status(200).send("Order created");

  } catch (err) {
    console.error("❌ Tabby webhook error:", err);
    return res.status(500).send("Webhook failed");
  }
};
