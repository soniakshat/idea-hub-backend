// models/Post.js

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  tags: [String],
  business: [String],
  status: { type: String, default: "draft" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: [commentSchema],
  likes: [{ type: String, default: [] }],
  resource: { type: String, required: false },
});

module.exports = mongoose.model("Post", postSchema);
