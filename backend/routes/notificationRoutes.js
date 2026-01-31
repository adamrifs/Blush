const express = require('express')
const { getAllNotifications, markAllNotificationsRead } = require('../controllers/notificationController')
const router = express.Router()

router.get('/notifications',getAllNotifications)
router.patch('/notifications/read-all', markAllNotificationsRead)

module.exports = router