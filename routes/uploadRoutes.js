const express = require("express");
const {
  upload,
  uploadImage,
  uploadCoverImage,
} = require("../controllers/uploadController");

const router = express.Router();

router.post("/send", upload.single("image"), uploadImage);
router.post("/upload", upload.single("image"), uploadCoverImage);

module.exports = router;
