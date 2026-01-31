const mongoose = require('mongoose')

const orderNotificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    type: {
      type: String,
      default: 'order',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 AUTO DELETE after 30 days
orderNotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 } // 30 days
);

module.exports = mongoose.model('OrderNotification', orderNotificationSchema);
