const axios = require("axios");

const PAYMOB_BASE = "https://uae.paymob.com/api";

exports.authenticate = async () => {
  console.log("PAYMOB_API_KEY =>", process.env.PAYMOB_API_KEY);
  const res = await axios.post(`${PAYMOB_BASE}/auth/tokens`, {
    api_key: process.env.PAYMOB_API_KEY,
  });
  return res.data.token;
};

exports.createOrder = async (token, amountCents) => {
  const res = await axios.post(
    `${PAYMOB_BASE}/ecommerce/orders`,
    {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "AED",
      items: [],
    }
  );
  return res.data;
};

exports.createPaymentKey = async ({
  token,
  orderId,
  amountCents,
  integrationId,
  billingData,
}) => {
  const res = await axios.post(
    `${PAYMOB_BASE}/acceptance/payment_keys`,
    {
      auth_token: token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      currency: "AED",
      integration_id: integrationId,
      billing_data: billingData,
    }
  );
  return res.data.token;
};
