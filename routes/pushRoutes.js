const express = require("express");
const router = express.Router();

const { subscribeUser } = require("../controllers/pushController");

// Save subscription route
router.post("/subscribe", subscribeUser);

module.exports = router;
