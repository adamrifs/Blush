const User = require("../models/userSchema");

exports.getCustomers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ customers: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
