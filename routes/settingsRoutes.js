// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/:adminId', getSettings);
router.put('/:adminId', updateSettings);

module.exports = router;
