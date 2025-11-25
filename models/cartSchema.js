const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sessionId: { type: String, required: false },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            addons: [{ name: String, price: Number, image: String }],

            // VAT fields
            basePrice: { type: Number },       // product.price from DB
            vatAmount: { type: Number },       // 5% VAT of base price
            priceWithVAT: { type: Number }     // final amount to be billed

        }
    ],
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart