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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await Media.countDocuments();

        const media = await Media.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            media,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch media" });
    }
};

