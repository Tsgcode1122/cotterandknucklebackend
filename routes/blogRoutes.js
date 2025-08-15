const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");

router.post("/postBlogs", BlogController.createBlog);
router.get("/getBlogs", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);
router.put("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

module.exports = router;
