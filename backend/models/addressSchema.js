const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },

    country: { type: String, default: "United Arab Emirates" },
    emirate: { type: String, required: true },
    area: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String, required: true },
    flat: { type: String, required: true },

    deliveryDate: { type: String, required: true },
    deliverySlot: { type: String, required: true },
    deliveryCharge: { type: Number, default: 0 },

}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema)
module.exports = Address