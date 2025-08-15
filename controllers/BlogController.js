const Blog = require("../models/Blog");

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const {
      description,
      title,
      author,
      imagesUrl,
      imagesAlt,
      metaDescription,
    } = req.body;
    console.log(
      description,
      title,
      author,
      imagesUrl,
      imagesAlt,
      metaDescription,
    );

    const newBlog = new Blog({
      description,
      title,
      author,
      imagesUrl,
      imagesAlt,
      metaDescription,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const {
      description,
      title,
      author,
      imagesUrl,
      imagesAlt,
      metaDescription,
    } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { description, title, author, imagesUrl, imagesAlt, metaDescription },
      { new: true, runValidators: true },
    );

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log(blogId);
    const deletedBlog = await Blog.findById(blogId);

    if (!deletedBlog) {
      console.log("noooooooo");
      return res.status(404).json({ message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
};
