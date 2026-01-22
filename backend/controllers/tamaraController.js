const axios = require("axios");

exports.createTamaraSession = async (req, res) => {
  try {
    const { cart, totals, shipping, user } = req.body;

    const payload = {
      total_amount: {
        amount: totals.grandTotal,
        currency: "AED"
      },
      consumer: {
        email: user.email,
        first_name: shipping.receiverName,
        phone_number: shipping.receiverPhone
      },
      items: cart.map(item => ({
        name: item.productId.name,
        quantity: item.quantity,
        unit_price: {
          amount: item.basePrice,
          currency: "AED"
        }
      })),
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      failure_url: `${process.env.FRONTEND_URL}/payment-failed`,
      order_reference_id: `BLUSH_${Date.now()}`
    };

    const response = await axios.post(
      `${process.env.TAMARA_API_BASE}/checkout`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAMARA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ url: response.data.checkout_url });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Tamara payment failed" });
  }
};
