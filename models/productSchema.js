const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: Array },
    description: { type: String, required: true },
    availableIn: {
        type: [String],
        default: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah", "Al Ain"]
    },
    occasions: {
        type: String,
        enum: [
            "General",
            "Mother's Day",
            "Valentine's Day",
            "Eid",
            "National Day",
            "Birthday",
            "Anniversary",
            "Graduation",
            "New Year",
        ],
        default: "General"
    },
    addons: [
        {
            name: { type: String },
            price: { type: Number },
            image: { type: String }
        }
    ],
    category: {
        type: String,
        enum: [
            "Bouquet",
            "Bouquet in Bag",
            "Box Arrangements",
            "Cake",
            "Cakes and Flowers",
            "Chocolate",
            "Chocolate and Flowers",
            "Combo Deals",
            "Flowers",
            "Forever Flowers",
            "Fresh Cakes",
            "Flower Basket",
            "Fruits and Flowers",
            "Hand Bouquet",
            "Mini Bag Arrangements",
            "Mini Bouquet",
            "Necklace",
            "Plants",
            "Vase Arrangements"
        ],
        required: true
    }

}, { timestamps: true }
)
const Product = mongoose.model('Product', productSchema)

module.exports = Product