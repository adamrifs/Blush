const OrderNotification = require('../models/OrderNotification')

// GET all notifications (latest first)
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await OrderNotification
            .find()
            .sort({ createdAt: -1 })

        res.status(200).json(notifications)
    } catch (error) {
        console.error('Notification fetch error:', error)
        res.status(500).json({ message: 'Failed to fetch notifications' })
    }
}

exports.markAllNotificationsRead = async (req, res) => {
    try {
        await OrderNotification.updateMany(
            { isRead: false },
            { $set: { isRead: true } }
        )

        res.status(200).json({ success: true })
    } catch (error) {
        console.error('Mark all notifications read error:', error)
        res.status(500).json({ success: false, message: 'Failed to update notifications' })
    }
}