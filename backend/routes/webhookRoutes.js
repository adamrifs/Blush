const express = require('express')
const { tabbyWebhook } = require('../controllers/webhookController')
const router = express.Router()

router.post("/tabby",tabbyWebhook)

module.exports = router