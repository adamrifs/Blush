const crypto = require("crypto");
const Order = require("../models/orderSchema");

exports.paymobWebhook = async (req, res) => {
  try {
    const receivedHmac = req.headers["hmac"];

    // 🔐 Generate HMAC locally
    const calculatedHmac = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (receivedHmac !== calculatedHmac) {
      return res.status(401).json({ message: "Invalid HMAC" });
    }

    const transaction = req.body.obj;

    // ✅ Only successful & non-refunded payments
    if (!transaction.success || transaction.is_refunded) {
      return res.status(200).json({ ignored: true });
    }

    const merchantOrderId = transaction.order.merchant_order_id;

    // ⚠️ Prevent duplicate orders
    const existing = await Order.findOne({
      "payment.transactionId": transaction.id,
    });

    if (existing) {
      return res.status(200).json({ alreadyProcessed: true });
    }

    // ✅ CREATE ORDER HERE (SECURE POINT)
    const order = new Order({
      userId: transaction.merchant_order_id_user, // optional
      items: transaction.order.items || [],
      payment: {
        method: transaction.source_data.type,
        status: "paid",
        transactionId: transaction.id,
        orderId: transaction.order.id,
        amount: transaction.amount_cents / 100,
        currency: transaction.currency,
      },
      status: "confirmed",
      createdAt: new Date(),
    });

    await order.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Paymob Webhook Error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
