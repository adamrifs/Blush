const User = require("../models/userSchema");
const Order = require('../models/orderSchema')

exports.getCustomers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        const results = await Promise.all(
            users.map(async (u) => {
                const orderCount = await Order.countDocuments({ userId: u._id });

                const fullName =
                    [u.firstname, u.lastname].filter(Boolean).join(" ") || "—";

                return {
                    _id: u._id,
                    name: fullName,
                    email: u.email,
                    phone: u.phone || "—",
                    totalOrders: orderCount,
                    createdAt: u.createdAt
                };
            })
        );

        res.json({ customers: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};
