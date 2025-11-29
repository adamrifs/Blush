const User = require("../models/userSchema");
const Order = require('../models/orderSchema')
exports.getCustomers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        const customersWithOrders = await Promise.all(
            users.map(async (u) => {
                const ordersCount = await Order.countDocuments({ userId: u._id });

                return {
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    phone: u.phone || "—",
                    createdAt: u.createdAt,
                    totalOrders: ordersCount,
                };
            })
        );

        res.json({ customers: customersWithOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
