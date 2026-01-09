const axios = require("axios");
const Order = require("../models/orderSchema");

exports.createTabbySession = async (req, res) => {
  try {
    const { orderPayload } = req.body;

    // 1️⃣ Create LOCAL order (PENDING)
    const order = await Order.create({
      ...orderPayload,
      payment: {
        ...orderPayload.payment,
        method: "tabby",
        status: "pending",
        transactionId: null,
      },
    });

    // 2️⃣ Create Tabby Checkout
    const { data } = await axios.post(
      `${process.env.TABBY_API_BASE}/api/v2/checkout`,
      {
        payment: {
          amount: orderPayload.totals.grandTotal,
          currency: "AED",
          description: `Blush Order ${order._id}`,
          buyer: {
            email: "customer@blush.ae",
            phone: orderPayload.shipping.receiverPhone,
            name: orderPayload.shipping.receiverName,
          },
          order: {
            reference_id: order._id.toString(),
            items: orderPayload.items.map((item) => ({
              title: "Blush Product",
              quantity: item.quantity,
              unit_price: item.addons?.[0]?.price || 0,
            })),
          },
        },
        merchant_code: process.env.TABBY_MERCHANT_CODE,
        lang: "en",
        merchant_urls: {
          success: `${process.env.CLIENT_URL}/payment/status?order=${order._id}`,
          cancel: `${process.env.CLIENT_URL}/payment-failed`,
          failure: `${process.env.CLIENT_URL}/payment-failed`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const checkoutUrl = data?.configuration?.available_products?.installments?.[0]?.web_url;

    if (!checkoutUrl) {
      return res.status(400).json({ error: "Tabby checkout unavailable" });
    }

    res.json({ redirect_url: checkoutUrl });
  } catch (error) {
    console.error("Tabby Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Tabby payment error",
      details: error.response?.data || error.message,
    });
  }
};
