const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadBulkImages } = require("../controllers/mediaController");
const { getAllMedia } = require("../controllers/mediaController");
const { deleteMedia } = require("../controllers/mediaController");
const { bulkDeleteMedia } = require("../controllers/mediaController");

const upload = multer({ dest: "uploads/" });

router.post(
    "/upload",
    upload.array("images", 100),
    uploadBulkImages
);
router.get("/all", getAllMedia);
router.delete("/delete/:id", deleteMedia);
router.post("/bulk-delete", bulkDeleteMedia);

module.exports = router;
