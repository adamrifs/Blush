const crypto = require("crypto");
const Order = require("../models/orderSchema");

exports.paymobWebhook = async (req, res) => {
  const receivedHmac = req.headers["hmac"];
  const calculatedHmac = crypto
    .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (receivedHmac !== calculatedHmac) {
    return res.status(401).json({ message: "Invalid HMAC" });
  }

  const transaction = req.body.obj;

  if (transaction.success && transaction.is_refunded === false) {
    const merchantOrderId = transaction.order.merchant_order_id;

    // Update order
    await Order.findOneAndUpdate(
      { _id: merchantOrderId },
      {
        "payment.status": "paid",
        "payment.transactionId": transaction.id,
      }
    );
  }

  res.status(200).json({ received: true });
};
