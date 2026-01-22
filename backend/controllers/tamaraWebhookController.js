const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");

exports.handleTamaraWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event_type !== "order.captured") {
      return res.status(200).send("Ignored");
    }

    const order = event.order;

    // 🔥 CREATE ORDER
    const newOrder = await Order.create({
      userEmail: order.consumer.email,

      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price.amount
      })),

      payment: {
        method: "tamara",
        status: "paid",
        transactionId: order.order_id,
        amount: order.total_amount.amount
      },

      totals: {
        grandTotal: order.total_amount.amount
      },

      shipping: {
        receiverName: order.consumer.first_name,
        phone: order.consumer.phone_number
      }
    });

    // 🧹 CLEAR CART
    await Cart.deleteMany({ userEmail: order.consumer.email });

    return res.status(200).send("Order created");

  } catch (err) {
    console.error("Tamara webhook error:", err);
    return res.status(500).send("Webhook failed");
  }
};
