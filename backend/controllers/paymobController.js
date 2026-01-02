const axios = require("axios");

// ------------------------------------------
// 1. AUTH TOKEN
// ------------------------------------------
const getAuthToken = async () => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/auth/tokens",
    {
      api_key: process.env.PAYMOB_API_KEY,
    }
  );
  return data.token;
};

// ------------------------------------------
// 2. ORDER REGISTRATION
// ------------------------------------------
const createOrder = async (authToken, amount, merchantOrderId) => {
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


// ------------------------------------------
// 3. PAYMENT KEY
// ------------------------------------------
const getPaymentKey = async (authToken, orderId, amount, integrationId) => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      auth_token: authToken,
      amount_cents: amount * 100,
      order_id: orderId,
      currency: "AED",
      billing_data: {
        email: "customer@example.com",
        first_name: "User",
        last_name: "Checkout",
        phone_number: "+971000000000",
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Dubai",
        country: "AE",
        state: "Dubai",
      },
      integration_id: integrationId,
    }
  );
  return data.token;
};

// ------------------------------------------
// 4. CREDIT CARD PAYMENT
// ------------------------------------------
exports.paymobCard = async (req, res) => {
  try {
    const { amount } = req.body;

    const authToken = await getAuthToken();
    const orderId = await createOrder(authToken, amount);
    const paymentKey = await getPaymentKey(
      authToken,
      orderId,
      amount,
      process.env.PAYMOB_INTEGRATION_ID_CARD
    );

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    res.json({ redirect_url: iframeUrl });
  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ error: "Paymob card payment error" });
  }
};

// ------------------------------------------
// 5. APPLE PAY PAYMENT
// ------------------------------------------
exports.paymobApplePay = async (req, res) => {
  try {
    const { amount } = req.body;

    const authToken = await getAuthToken();
    const orderId = await createOrder(authToken, amount);
    const paymentKey = await getPaymentKey(
      authToken,
      orderId,
      amount,
      process.env.PAYMOB_INTEGRATION_ID_APPLEPAY
    );

    res.json({
      redirect_url: `https://accept/paymob.com/api/acceptance/payments/pay?payment_token=${paymentKey}`,
    });
  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ error: "Paymob Apple Pay error" });
  }
};
