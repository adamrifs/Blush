const AdminSettings = require('../models/AdminSettings');

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