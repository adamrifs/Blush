const express = require("express");
const { getCustomers } = require("../controllers/customerController");
const router = express.Router();

router.get("/getCustomers", getCustomers);

module.exports = router;
