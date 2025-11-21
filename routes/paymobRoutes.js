const router = require("express").Router();
const {
  paymobCard,
  paymobApplePay,
} = require("../controllers/paymobController");

router.post("/card", paymobCard);
router.post("/applepay", paymobApplePay);

module.exports = router;
