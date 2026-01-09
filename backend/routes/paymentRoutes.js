const express = require('express')
const { createTabbySession } = require('../controllers/tabbyController')
const router = express.Router()

router.post("/tabby",createTabbySession)

module.exports = router