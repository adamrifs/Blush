const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Media = require('../models/mediaSchema')
exports.uploadBulkImages = async (req, res) => {
    try {
        const folder = req.body.folder || "bulk-products";

        const uploads = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder
                });

                fs.unlinkSync(file.path);

                const media = await Media.create({
                    url: result.secure_url,
                    public_id: result.public_id,
                    folder
                });

                return media;
            })
        );

        res.json({ images: uploads });
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
};

exports.getAllMedia = async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.json({ media });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch media" });
    }
};
