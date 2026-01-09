const axios = require("axios");
const Order = require("../models/orderSchema");

/* ------------------------------
   1️⃣ Get Auth Token
--------------------------------*/
const getAuthToken = async () => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/auth/tokens",
    {
      api_key: process.env.PAYMOB_API_KEY,
    }
  );
  return data.token;
};

/* ------------------------------
   2️⃣ Create Paymob Order
--------------------------------*/
const createPaymobOrder = async (authToken, amount, merchantOrderId) => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/ecommerce/orders",
    {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amount * 100,
      currency: "AED",
      merchant_order_id: merchantOrderId,
      items: [],
    }
  );
  return data.id;
};

/* ------------------------------
   3️⃣ Payment Key
--------------------------------*/
const getPaymentKey = async (
  authToken,
  paymobOrderId,
  amount,
  integrationId
) => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      auth_token: authToken,
      amount_cents: amount * 100,
      order_id: paymobOrderId,
      currency: "AED",
      integration_id: integrationId,
      billing_data: {
        email: "customer@blush.com",
        first_name: "Blush",
        last_name: "Customer",
        phone_number: "+971000000000",
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "00000",
        city: "Dubai",
        country: "AE",
        state: "Dubai",
      },
    }
  );

  return data.token;
};

/* ------------------------------
   4️⃣ CARD PAYMENT
--------------------------------*/
exports.paymobCard = async (req, res) => {
  try {
    const { amount, orderPayload } = req.body;

    // 1️⃣ Create LOCAL order (PENDING)
    const order = await Order.create({
      ...orderPayload,
      payment: {
        ...orderPayload.payment,
        method: "card",
        status: "pending",
        transactionId: null,
      },
    });

    // 2️⃣ Paymob flow
    const authToken = await getAuthToken();
    const paymobOrderId = await createPaymobOrder(
      authToken,
      amount,
      order._id.toString()
    );

    const paymentKey = await getPaymentKey(
      authToken,
      paymobOrderId,
      amount,
      process.env.PAYMOB_INTEGRATION_ID_CARD
    );

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    res.json({ redirect_url: iframeUrl });
  } catch (error) {
    console.log(" PAYMOB ERROR FULL:", error.response?.data || error);
    return res.status(500).json({
      error: "Paymob card payment error",
      details: error.response?.data || error.message,
    });
  }

};

/* ------------------------------
   5️⃣ APPLE PAY
--------------------------------*/
exports.paymobApplePay = async (req, res) => {
  try {
    const { amount, orderPayload } = req.body;

    // ✅ CREATE LOCAL ORDER (PENDING) – KEEP REQUIRED FIELDS
    const order = await Order.create({
      ...orderPayload,
      payment: {
        ...orderPayload.payment,   // 🔥 KEEP amount & vat
        method: "applepay",
        status: "pending",
        transactionId: null,
      },
    });

    const authToken = await getAuthToken();

    const paymobOrderId = await createPaymobOrder(
      authToken,
      amount,
      order._id.toString()
    );

    const paymentKey = await getPaymentKey(
      authToken,
      paymobOrderId,
      amount,
      process.env.PAYMOB_INTEGRATION_ID_APPLEPAY
    );

    res.json({
      redirect_url: `https://accept.paymob.com/api/acceptance/payments/pay?payment_token=${paymentKey}`,
    });
  } catch (error) {
    console.error("Paymob ApplePay Error:", error.response?.data || error);
    return res.status(500).json({
      error: "Paymob ApplePay error",
      details: error.response?.data || error.message,
    });
  }
};

