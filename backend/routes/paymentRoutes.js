const express = require('express')
const { createTabbySession } = require('../controllers/tabbyController');
const { initPaymobPayment, createStripeSession } = require('../controllers/paymentController');
const { createTamaraSession } = require('../controllers/tamaraController');
const { handleTabbyWebhook } = require('../controllers/tabbyWebhookController');
const { handleTamaraWebhook } = require('../controllers/tamaraWebhookController');
const router = express.Router()

router.post("/tabby", createTabbySession);
router.post("/tamara", createTamaraSession);
router.post("/paymob/init", initPaymobPayment);

// stripe 
router.post("/create-stripe-session", createStripeSession);

// webhooks
router.post("/webhook/tabby", express.json(), handleTabbyWebhook);
router.post("/webhook/tamara", express.json(), handleTamaraWebhook);
module.exports = router