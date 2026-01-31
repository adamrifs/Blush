const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "admin", // must match Admin model name
  },

  pushEnabled: { type: Boolean, default: false },
  pushTokens: { type: [String], default: [] },

  emailEnabled: { type: Boolean, default: true },
  smsEnabled: { type: Boolean, default: false },
  soundEnabled: { type: Boolean, default: true },
  vibrationEnabled: { type: Boolean, default: true },

  email: String,
  phone: String,
  
  deliveryCharges: [
    {
      emirate: { type: String, required: true },
      slot: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
}, { timestamps: true });


module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
