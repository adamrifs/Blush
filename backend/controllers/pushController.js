const webPush = require("web-push");
const User = require("../models/userSchema"); // same as your file
const Admin = require("../models/adminSchema");

// ===============================
//  CONFIGURE VAPID KEYS
// ===============================
webPush.setVapidDetails(
  "mailto:admin@blush.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ===============================
//  SAVE SUBSCRIPTION
// ===============================
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

// ===============================
//  SEND PUSH NOTIFICATION (REUSABLE)
// ===============================
exports.sendPushNotification = async (subscription, payload) => {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.log("Push send error:", err);
  }
};

// ===============================
//  TEST NOTIFICATION ENDPOINT
// ===============================
exports.testNotification = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user.subscription) {
      return res.status(400).json({ message: "User has no subscription" });
    }

    await webPush.sendNotification(
      user.subscription,
      JSON.stringify({
        title: "Blush Test Notification 💐",
        message: "Push notifications are working!",
      })
    );

    res.json({ success: true, message: "Test push sent" });
  } catch (err) {
    console.log("Push test error:", err);
    res.status(500).json({ message: "Failed to send test push" });
  }
};

// Admin push subscribe
exports.subscribeAdmin = async (req, res) => {
  try {
    const { subscription } = req.body;

    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ subscription });
    } else {
      admin.subscription = subscription;
    }

    await admin.save();

    res.status(201).json({ success: true, message: "Admin subscribed" });
  } catch (err) {
    console.log("Admin push error:", err);
    res.status(500).json({ message: "Failed to save admin subscription" });
  }
};