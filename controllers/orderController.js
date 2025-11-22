const Order = require("../models/orderSchema");

// ----------------------------------------------------------
// CREATE NEW ORDER
// ----------------------------------------------------------
exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
};

// ----------------------------------------------------------
// GET USER ORDERS
// ----------------------------------------------------------
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

        const orders = await Order.find({ userId })
            .populate("items.productId", "name price image description category");

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ----------------------------------------------------------
// GET SINGLE ORDER BY ID
// ----------------------------------------------------------
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.productId", "name price image description category");

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ----------------------------------------------------------
// ADMIN: GET ALL ORDERS
// ----------------------------------------------------------
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

// ----------------------------------------------------------
// ADMIN: UPDATE ORDER STATUS
// ----------------------------------------------------------
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};
