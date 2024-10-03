// controllers/postController.js

const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const {
      id, title, author, tags, business, status, content, timestamp, upvotes, downvotes, comments
    } = req.body.post;

    const newPost = new Post({
      id, title, author, tags, business, status, content, timestamp, upvotes, downvotes, comments
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Retrieve all posts
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get limited posts based on 'n-posts' header
exports.getLimitedPosts = async (req, res) => {
  try {
    const n = parseInt(req.headers['n-posts'], 10); // Get the 'n-posts' value from the headers
    
    if (isNaN(n) || n <= 0) {
      return res.status(400).json({ message: 'Invalid number of posts requested' });
    }

    const posts = await Post.find().limit(n); // Limit the number of posts
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get posts by tag (from headers)
exports.getPostsByTag = async (req, res) => {
  try {
    const tag = req.headers['tag']; // Get the 'tag' from headers
    if (!tag) {
      return res.status(400).json({ message: 'Tag is required in the headers' });
    }

    const posts = await Post.find({ tags: tag }); // Find posts with the given tag
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by tag', error: error.message });
  }
};

// Get posts by business (from headers)
exports.getPostsByBusiness = async (req, res) => {
  try {
    const business = req.headers['business']; // Get the 'business' from headers
    if (!business) {
      return res.status(400).json({ message: 'Business is required in the headers' });
    }

    const posts = await Post.find({ business: business }); // Find posts related to the given business
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by business', error: error.message });
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get post ID from the request parameters
    const updatedData = req.body; // Get updated post data from the request body

    // Find the post by ID and update it
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get post ID from the request parameters

    // Find the post by ID and delete it
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};