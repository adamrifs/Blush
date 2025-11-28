const express = require("express");
const router = express.Router();

const {
  subscribeUser,
  testNotification
} = require("../controllers/pushController");

// save subscription
router.post("/subscribe", subscribeUser);

// test push manually
router.get("/test/:userId", testNotification);

module.exports = router;
