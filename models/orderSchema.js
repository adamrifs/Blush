const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    // 🛒 CART ITEMS (same as your cartSchema)
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            addons: [{ name: String, price: Number, image: String }]
        }
    ],

    // 📦 SHIPPING DETAILS (matches addressSchema)
    shipping: {
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
        deliveryCharge: { type: Number, default: 0 }
    },

    // 💳 PAYMENT DETAILS
    payment: {
        method: { type: String, enum: ["card", "applepay", "tabby", "tamara"], required: true },
        status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        transactionId: { type: String },      // Paymob transaction / payment key
        orderId: { type: String },            // Paymob order id
        amount: { type: Number, required: true },
        vat: { type: Number, required: true }
    },

    // TOTALS
    totals: {
        bagTotal: { type: Number, required: true },
        deliveryCharge: { type: Number, required: true },
        vatAmount: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
    },

    // TRACKING
    status: {
        type: String,
        enum: ["pending", "processing", "out_for_delivery", "delivered", "cancelled"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
