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

        const settings = await AdminSettings.findOneAndUpdate(
            { adminId },
            { $set: req.body },
            { new: true, upsert: true }
        );

        res.json({ success: true, settings });
        
    } catch (error) {
        console.log("Update Settings Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
