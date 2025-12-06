// controllers/settingsController.js
const AdminSettings = require('../models/AdminSettings');

exports.getSettings = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    let settings = await AdminSettings.findOne({ adminId });

    if (!settings) {
      // create default
      settings = await AdminSettings.create({ adminId, email: req.query.email || '' });
    }
    res.json({ success: true, settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const updates = req.body;
    const settings = await AdminSettings.findOneAndUpdate(
      { adminId },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json({ success: true, settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
