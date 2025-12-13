const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadBulkImages } = require("../controllers/mediaController");

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  upload.array("images", 50),
  uploadBulkImages
);

module.exports = router;
