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
  const { postId } = req.params;
  const userId = req.user.id; // authenticated user ID
  try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      // Check if the post belongs to the authenticated user
      if (post.creator.toString() !== userId) {
          return res.status(403).json({ message: 'Unauthorized to edit this post' });
      }

      // Update the post with new data
      const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
      res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update post', error });
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

exports.getUserPosts = async (req, res) => {
  try {
    // Extract userId from the query parameters instead of the request body
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // console.log('User ID:', userId);  // Debugging: Log the received user ID

    // Find posts where the author ID matches the provided user ID
    const posts = await Post.find({ 'author.id': userId });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    // Send the posts in the response
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve posts', error });
  }
};

// Update upvote count for a post
exports.updateUpvote = async (req, res) => {
  const { increment } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { upvotes: increment } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update upvotes', error: error.message });
  }
};

// Update downvote count for a post
exports.updateDownvote = async (req, res) => {
  const { increment } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { downvotes: increment } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update downvotes', error: error.message });
  }
};