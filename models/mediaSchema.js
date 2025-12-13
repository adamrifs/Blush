const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    folder: { type: String, default: "bulk-products" },
    originalName: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
