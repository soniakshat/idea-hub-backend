// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware');  // Auth middleware

// Route for creating a post (protected by auth)
router.post('/', auth, postController.createPost);

// Route for getting all posts (protected by auth)
router.get('/all', auth, postController.getAllPosts);

// Route for getting limited posts from the 'n-posts' header (protected by auth)
router.get('/limit', auth, postController.getLimitedPosts);

// Route for getting posts by 'tag' from the headers (protected by auth)
router.get('/tag', auth, postController.getPostsByTag);

// Route for getting posts by 'business' from the headers (protected by auth)
router.get('/business', auth, postController.getPostsByBusiness);

module.exports = router;
