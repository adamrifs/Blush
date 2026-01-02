const express = require("express");
const router = express.Router();

const {
  paymobCard,
  paymobApplePay,
} = require("../controllers/paymobController");
const { paymobWebhook } = require("../controllers/paymobWebhookController");

router.post("/card", paymobCard);
router.post("/applepay", paymobApplePay);
router.post("/webhook", express.json({ type: "*/*" }), paymobWebhook);
module.exports = router;
