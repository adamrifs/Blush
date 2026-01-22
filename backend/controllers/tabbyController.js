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
          name: shipping.receiverName
        },
        order: {
          reference_id: `BLUSH_${Date.now()}`,
          items: cart.map(item => ({
            title: item.productId.name,
            quantity: item.quantity,
            unit_price: item.basePrice,
            category: "Flowers"
          }))
        },
        shipping_address: {
          city: shipping.emirate,
          address: `${shipping.area}, ${shipping.street}`,
          zip: "00000"
        }
      },
      lang: "en",
      merchant_code: process.env.TABBY_MERCHANT_CODE,
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`
    };

    const response = await axios.post(
      `${process.env.TABBY_API_BASE}/api/v2/checkout`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ url: response.data.configuration.available_products.installments[0].web_url });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Tabby session failed" });
  }
};
