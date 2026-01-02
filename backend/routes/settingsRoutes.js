const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/adminMiddleware");
const { getSettings, updateSettings } = require("../controllers/settingsController");

router.get("/", protectRoute, getSettings);
router.put("/", protectRoute, updateSettings);

module.exports = router;
