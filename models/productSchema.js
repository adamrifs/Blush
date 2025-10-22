const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: Array },
    description: { type: String, required: true },
    occasions: {
        type: String,
        enum: [
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
            "Cake",
            "Flower",
            "Gift",
            "Chocolate",
            "Combo",
            "Other"
        ],
        required: true
    }
}, { timestamps: true }
)
const Product = mongoose.model('Product', productSchema)

module.exports = Product