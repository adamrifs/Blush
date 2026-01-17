const express = require("express")
const router = express.Router()
const { handleStripeWebhook } = require("../controllers/stripeWebhookController")

// IMPORTANT: raw body required for Stripe
router.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

module.exports = router
