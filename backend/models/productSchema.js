const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    //  Basic info
    name: { type: String, required: true },

    //  SEO-friendly URL
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    //  Product type
    type: {
        type: String,
        enum: ["simple", "variable"],
        default: "simple",
        required: true
    },

    //  SKU
    sku: {
        type: String,
        unique: true,
        sparse: true
    },

    //  Pricing
    regularPrice: { type: Number, required: true },
    price: { type: Number },

    //  Stock
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },

    //  Featured
    isFeatured: { type: Boolean, default: false },

    //  Media
    image: { type: [String], default: [] },

    //  Description
    description: { type: String, required: true },

    //  Availability
    availableIn: {
        type: [String],
        default: [
            "Abu Dhabi",
            "Dubai",
            "Sharjah",
            "Ajman",
            "Umm Al Quwain",
            "Ras Al Khaimah",
            "Fujairah",
            "Al Ain"
        ]
    },

    //  Occasions
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
            "New Year"
        ],
        default: "General"
    },

    //  Add-ons
    addons: [
        {
            name: { type: String },
            price: { type: Number },
            image: { type: String }
        }
    ],

    //  Category
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
    },

    //  Variations (for variable products)
    variations: [
        {
            label: String,   // e.g. "500g", "1kg"
            price: Number,
            stock: Number,
            sku: String
        }
    ]

}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
module.exports = Product
