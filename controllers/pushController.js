const User = require("../models/userSchema"); // adjust if needed

// Save user's push subscription
exports.subscribeUser = async (req, res) => {
  const { userId, subscription } = req.body;

  try {
    if (!userId || !subscription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await User.findByIdAndUpdate(userId, { subscription }, { new: true });

    res.status(201).json({ success: true, message: "Subscription saved" });

  } catch (err) {
    console.log("Push subscription error:", err);
    res.status(500).json({ message: "Failed to save subscription" });
  }
};
