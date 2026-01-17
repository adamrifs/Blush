const {
  authenticate,
  createOrder,
  createPaymentKey,
} = require("../services/paymob.service");

const stripe = require("../config/stripe");
const Product = require("../models/productSchema");

// ---------------- PAYMOB ----------------
exports.initPaymobPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, user } = req.body;

    const amountCents = Math.round(amount * 100);
    const token = await authenticate();
    const order = await createOrder(token, amountCents);

    const integrationId =
      paymentMethod === "applepay"
        ? process.env.PAYMOB_INTEGRATION_ID_APPLEPAY
        : process.env.PAYMOB_INTEGRATION_ID_CARD;

    const billingData = {
      first_name: user.name,
      last_name: user.name,
      email: user.email,
      phone_number: user.phone,
      country: "AE",
      city: "Dubai",
      street: "NA",
      building: "NA",
      apartment: "NA",
      floor: "NA",
      postal_code: "00000",
    };

    const paymentKey = await createPaymentKey({
      token,
      orderId: order.id,
      amountCents,
      integrationId,
      billingData,
    });

    const iframeURL = `https://uae.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.json({ iframeURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Paymob payment failed" });
  }
};

// ---------------- STRIPE ----------------
exports.createStripeSession = async (req, res) => {
  try {
    const { cart, totals, shipping, userId, cardMessage } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: "Blush Order",
              description: "Flowers, delivery & VAT included"
            },
            unit_amount: Math.round(totals.grandTotal * 100)
          },
          quantity: 1
        }
      ],

      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,

      metadata: {
        userId,
        shipping: JSON.stringify(shipping),
        totals: JSON.stringify(totals),
        cardMessage: JSON.stringify(cardMessage),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ message: "Stripe session failed" });
  }
};
