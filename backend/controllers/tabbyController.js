const axios = require("axios");
const Order = require("../models/orderSchema");

exports.createTabbySession = async (req, res) => {
  try {
    const { userId, senderName, senderPhone, cart, totals, payment, shipping, cardMessage } = req.body;

    const normalizedShipping = {
      ...shipping,
      building: shipping.building || "N/A",
      flat: shipping.flat || "N/A",
      deliverySlot: {
        title: shipping.deliverySlot?.title,
        time: shipping.deliverySlot?.time,
      },
    };

    const order = await Order.create({
      userId,

      // ✅ ADD SENDER HERE
      sender: {
        name: senderName,
        phone: senderPhone,
      },

      items: cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        addons: item.addons || [],
      })),

      shipping: normalizedShipping,

      payment: {
        method: "tabby",
        status: "pending",
        amount: payment?.amount || totals.grandTotal,
        vat: payment?.vat || totals.vatAmount,
      },

      totals,
      cardMessage,
      status: "pending",
    });

    const payload = {
      payment: {
        amount: totals.grandTotal,
        currency: "AED",
        description: "Blush Flowers Order",
        buyer: {
          email: shipping.email || "customer@blushflowers.ae",
          phone: shipping.receiverPhone,
          name: shipping.receiverName,
        },
        order: {
          reference_id: order._id.toString(),
          items: cart.map(item => ({
            title: item.productId.name,
            quantity: item.quantity,
            unit_price: item.basePrice,
            category: "Flowers",
          })),
        },
      },
      merchant_urls: {
        success: `${process.env.FRONTEND_URL}/payment-success`,
        cancel: `${process.env.FRONTEND_URL}/payment-failed?order=${order._id}`,
        failure: `${process.env.FRONTEND_URL}/payment-failed?order=${order._id}`,
      },
      lang: "en",
      merchant_code: process.env.TABBY_MERCHANT_CODE,
    };

    const response = await axios.post(
      "https://api.tabby.ai/api/v2/checkout",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      url: response.data.configuration.available_products.installments[0].web_url,
    });

  } catch (err) {
    console.error("❌ Tabby session error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.tabbyFail = async (req, res) => {
  const { orderId } = req.params;

  await Order.findByIdAndUpdate(orderId, {
    "payment.status": "failed",
    status: "cancelled",
  });

  res.sendStatus(200);
};