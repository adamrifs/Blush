const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Media = require('../models/mediaSchema')
const path = require("path");

exports.uploadBulkImages = async (req, res) => {
  try {
    const folder = req.body.folder || "bulk-products";

    const uploads = await Promise.all(
      req.files.map(async (file) => {

        const fileName = `${Date.now()}-${path.parse(file.originalname).name}`;

        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          public_id: fileName,
          use_filename: true,
          unique_filename: false
        });

        fs.unlinkSync(file.path);

        const media = await Media.create({
          url: result.secure_url,
          public_id: result.public_id,
          folder,
          originalName: file.originalname
        });

        return media;
      })
    );

    res.json({ images: uploads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};


exports.getAllMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const sortOrder = req.query.sort === "desc" ? -1 : 1;
    const total = await Media.countDocuments();

    const media = await Media.find()
      .sort({ originalName: sortOrder })
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

exports.bulkDeleteMedia = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No images selected" });
    }

    // 1️⃣ Find media records
    const mediaList = await Media.find({ _id: { $in: ids } });

    // 2️⃣ Delete from Cloudinary
    await Promise.all(
      mediaList.map(media =>
        cloudinary.uploader.destroy(media.public_id)
      )
    );

    // 3️⃣ Delete from DB
    await Media.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${mediaList.length} images deleted successfully`
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ message: "Bulk delete failed" });
  }
};
