const { verifySignature } = require("../config/webhookSignature");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema"); // adjust if path differs

exports.handleTabbyWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-tabby-signature"];

    if (!signature) {
      return res.status(400).send("Missing signature");
    }

    const isValid = verifySignature(
      req.body,
      signature,
      process.env.TABBY_SECRET_KEY
    );

    if (!isValid) {
      return res.status(401).send("Invalid signature");
    }

    const eventType = req.body.type;

    if (eventType !== "payment.captured") {
      return res.status(200).send("Event ignored");
    }

    const payment = req.body.data;

    const exists = await Order.findOne({
      "payment.transactionId": payment.id,
    });

    if (exists) {
      return res.status(200).send("Already processed");
    }
    if (payment.amount?.currency !== "AED") {
      return res.status(400).send("Invalid currency");
    }

    const newOrder = await Order.create({
      userEmail: payment.buyer.email,

      items: payment.order.items.map((item) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.unit_price,
      })),

      shipping: payment.shipping_address
        ? {
            emirate: payment.shipping_address.city,
            address: payment.shipping_address.address,
          }
        : {},

      payment: {
        method: "tabby",
        status: "paid",
        transactionId: payment.id,
        amount: payment.amount.amount,
      },

      totals: {
        grandTotal: payment.amount.amount,
      },
    });

    await Cart.deleteMany({
      userEmail: payment.buyer.email,
    });
    return res.status(200).send("Order created successfully");

  } catch (error) {
    console.error(" Tabby Webhook Error:", error);
    return res.status(500).send("Webhook processing failed");
  }
};
