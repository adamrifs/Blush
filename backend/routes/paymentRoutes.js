const express = require('express')
const { createTabbySession } = require('../controllers/tabbyController');
const { initPaymobPayment, createStripeSession } = require('../controllers/paymentController');
const router = express.Router()

router.post("/tabby",createTabbySession)
router.post("/paymob/init", initPaymobPayment);

// stripe 
router.post("/create-stripe-session", createStripeSession);
module.exports = router