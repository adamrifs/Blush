const crypto = require("crypto");
const Order = require("../models/orderSchema");

exports.paymobWebhook = async (req, res) => {
  try {
    const receivedHmac = req.headers["hmac"];

    const calculatedHmac = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (receivedHmac !== calculatedHmac) {
      return res.status(401).json({ message: "Invalid HMAC" });
    }

    const transaction = req.body.obj;

    //  Ignore failed / refunded payments
    if (!transaction.success || transaction.is_refunded) {
      return res.status(200).json({ ignored: true });
    }

    const merchantOrderId = transaction.order.merchant_order_id;

    // ✅ UPDATE ORDER AFTER PAYMENT SUCCESS
    await Order.findByIdAndUpdate(
      merchantOrderId,
      {
        "payment.status": "paid",
        "payment.transactionId": transaction.id,
        status: "confirmed",
      },
      { new: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Paymob Webhook Error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};

