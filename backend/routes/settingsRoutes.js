const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/adminMiddleware");
const { getSettings, updateSettings, savePushToken, testEmail, getPublicDeliveryCharges,} = require("../controllers/settingsController");

router.get("/", protectRoute, getSettings);
router.put("/", protectRoute, updateSettings);
router.post("/test-email", protectRoute, testEmail);
router.get("/public", getPublicDeliveryCharges);
router.post("/push-token", protectRoute, savePushToken);
module.exports = router;
