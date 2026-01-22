const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/adminMiddleware");
const { getSettings, updateSettings, savePushToken,} = require("../controllers/settingsController");

router.get("/", protectRoute, getSettings);
router.put("/", protectRoute, updateSettings);

router.post("/push-token", protectRoute, savePushToken);
module.exports = router;
