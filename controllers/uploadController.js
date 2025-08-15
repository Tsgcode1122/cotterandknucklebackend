const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/User"); // Import your User model

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder where images will be stored on Cloudinary
    format: async () => "png", // Ensure PNG format
    public_id: (req, file) => file.originalname.split(".")[0], // Generate a unique name if needed
  },
});

const upload = multer({ storage: storage });

// Controller function to handle image upload and user update
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const uploadedImageUrl = req.file.path;

    // Find user by ID and update the image field
    const user = await User.findByIdAndUpdate(
      userId,
      { image: uploadedImageUrl },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ imageUrl: uploadedImageUrl, user });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedImageUrl = req.file.path;

    res.json({ imageUrl: uploadedImageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  upload,
  uploadImage,
  uploadCoverImage,
};
