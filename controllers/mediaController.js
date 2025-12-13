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

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find media in DB
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // 2️⃣ Delete from Cloudinary
    await cloudinary.uploader.destroy(media.public_id);

    // 3️⃣ Delete from MongoDB
    await Media.findByIdAndDelete(id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};
