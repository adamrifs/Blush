const Order = require("../models/orderSchema");

exports.tabbyWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.status !== "AUTHORIZED") {
      return res.status(200).json({ ignored: true });
    }

    const orderId = event.order?.reference_id;

    await Order.findByIdAndUpdate(orderId, {
      "payment.status": "paid",
      "payment.transactionId": event.id,
      status: "confirmed",
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Tabby Webhook Error:", error);
    res.status(500).json({ error: "Webhook failed" });
  }
};
