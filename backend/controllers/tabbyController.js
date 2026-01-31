const axios = require("axios");

exports.createTabbySession = async (req, res) => {
  try {
    const { cart, totals, shipping, user } = req.body;

    const payload = {
      payment: {
        amount: totals.grandTotal,
        currency: "AED",
        description: "Blush Flowers Order",
        buyer: {
          email: user.email,
          phone: shipping.receiverPhone,
          name: shipping.receiverName,
        },
        order: {
          reference_id: `BLUSH_${Date.now()}`,
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
        cancel: `${process.env.FRONTEND_URL}/payment-failed`,
        failure: `${process.env.FRONTEND_URL}/payment-failed`,
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

  } catch (error) {
    console.error("Tabby session error:", error.response?.data || error.message);
    res.status(500).json({ message: "Tabby session failed" });
  }
};
