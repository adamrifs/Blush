const AdminSettings = require('../models/AdminSettings');
const { sendEmail } = require("../config/emailSender");

exports.getSettings = async (req, res) => {
  try {
    const adminId = req.admin._id;

    let settings = await AdminSettings.findOne({ adminId });

    if (!settings) {
      // Create default settings for this admin
      settings = await AdminSettings.create({ adminId });
    }

    res.json({ success: true, settings });

  } catch (error) {
    console.log("Get Settings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const adminId = req.admin._id;

    // ❗ REMOVE pushTokens from body if it exists
    const { pushTokens, ...safeBody } = req.body;

    const settings = await AdminSettings.findOneAndUpdate(
      { adminId },
      { $set: safeBody },
      { new: true, upsert: true }
    );

    res.json({ success: true, settings });
  } catch (error) {
    console.log("Update Settings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.savePushToken = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    let settings = await AdminSettings.findOne({ adminId });

    if (!settings) {
      settings = new AdminSettings({ adminId });
    }

    if (!settings.pushTokens.includes(token)) {
      settings.pushTokens.push(token);
    }

    settings.pushEnabled = true;
    await settings.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Save push token error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// TEST EMAIL CONTROLLER
// ===============================
exports.testEmail = async (req, res) => {
  try {
    const adminId = req.admin._id;

    const adminSettings = await AdminSettings.findOne({ adminId });

    if (!adminSettings || !adminSettings.email) {
      return res.status(400).json({
        success: false,
        message: "No email configured",
      });
    }

    await sendEmail(
      adminSettings.email,
      "✅ Test Email from Blush",
      `
        <h3>Email Alerts Test</h3>
        <p>This is a test email.</p>
        <p>Your email alerts are working successfully 🎉</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
    });
  }
};

exports.getPublicDeliveryCharges = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne({});

    return res.status(200).json({
      success: true,
      deliveryCharges: settings?.deliveryCharges || [],
    });
  } catch (error) {
    console.error("❌ Error fetching public delivery charges:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery charges",
    });
  }
};