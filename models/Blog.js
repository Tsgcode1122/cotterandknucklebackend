const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  imagesUrl: {
    type: String,
    // required: true,
  },
  imagesAlt: {
    type: String,
    required: true,
  },
  // metaDescription: {
  //   type: String,
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
BlogSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

// Ensure virtuals are included when converting to JSON
BlogSchema.set("toJSON", { virtuals: true });
BlogSchema.set("toObject", { virtuals: true });

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
