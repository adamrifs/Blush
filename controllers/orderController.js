const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const webPush = require("web-push");


// VAPID CONFIG

webPush.setVapidDetails(
    "mailto:admin@blush.com",
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
);

// Reusable function to send push notifications
const sendPushNotification = async (subscription, payload) => {
    try {
        await webPush.sendNotification(subscription, JSON.stringify(payload));
    } catch (err) {
        console.log("Push send error:", err);
    }
};

// CREATE ORDER
exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();


        const Admin = require("../models/adminSchema");
        let admin = await Admin.findOne();

        // If no admin found, create one to prevent errors
        if (!admin) {
            admin = new Admin({ subscription: null });
            await admin.save();
        }

        // If admin has subscribed to push notifications
        if (admin.subscription) {
            await sendPushNotification(admin.subscription, {
                title: "New Order Received 💐",
                message: `Order #${order._id} has been placed.`,
            });
            console.log("Admin push notification sent");
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });

    } catch (error) {
        console.log("Create Order Error:", error);
        res.status(500).json({ message: error.message });
    }
};



// GET ALL ORDERS (ADMIN)

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("items.productId", "name price image description category")
            .populate("userId", "name email phone");

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log("Get All Orders Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET ORDER BY ID
// ===============================
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.productId", "name price image description category")
            .populate("userId", "name email phone subscription");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.log("Get Order Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET USER ORDERS
// ===============================
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate("items.productId", "name price image description category");

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log("Get User Orders Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// UPDATE ORDER STATUS (ADMIN)
// ===============================
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findById(orderId).populate("userId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        // 🔥 SEND PUSH NOTIFICATION IF USER IS SUBSCRIBED
        if (order.userId && order.userId.subscription) {
            await sendPushNotification(order.userId.subscription, {
                title: "Blush Order Update 💐",
                message: `Your order is now ${status.replace(/_/g, " ")}.`,
            });
            console.log("Push notification sent!");
        }

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order,
        });
    } catch (error) {
        console.log("Status Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// DELETE ORDER (OPTIONAL)
// ===============================
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        console.log("Delete Order Error:", error);
        res.status(500).json({ message: error.message });
    }
};
