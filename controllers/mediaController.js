const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadBulkImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploads = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "bulk-products"
        });

        fs.unlinkSync(file.path);

        return {
          url: result.secure_url,
          public_id: result.public_id
        };
      })
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      images: uploads
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed" });
  }
};
