const Stripe = require("stripe");
const Order = require("../models/orderSchema");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook Signature Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const order = new Order({
                userId: session.metadata.userId,

                items: [],

                shipping: JSON.parse(session.metadata.shipping),

                payment: {
                    method: "card",
                    status: "paid",
                    transactionId: session.payment_intent,
                    orderId: session.id,
                    amount: session.amount_total / 100,
                    vat: JSON.parse(session.metadata.totals).vatAmount,
                },

                totals: JSON.parse(session.metadata.totals),
                cardMessage: JSON.parse(session.metadata.cardMessage),
            });

            await order.save();
        }


        res.json({ received: true });
    } catch (err) {
        console.error("Webhook Processing Error:", err);
        res.status(500).json({ message: "Webhook processing failed" });
    }
};
