const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sessionId: { type: String, required: false },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            addons: [{ name: String, price: Number, image: String }],
            basePrice: { type: Number }, 
        }
    ],
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart