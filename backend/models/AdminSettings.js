const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'Admin' },
  pushEnabled: { type: Boolean, default: false },
  emailEnabled: { type: Boolean, default: true },
  smsEnabled: { type: Boolean, default: false },
  soundEnabled: { type: Boolean, default: true },
  vibrationEnabled: { type: Boolean, default: true },
  email: { type: String },   // admin email for alerts
  phone: { type: String },   // phone number if using SMS
}, { timestamps: true });

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
