// routes/postRoutes.js

const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/authMiddleware"); // Auth middleware
const upload = require("../middlewares/uploadMiddleware"); // Upload middleware

// Route for creating a post (protected by auth)
router.post("/", auth, upload.single("resource"), postController.createPost);

// Route for getting all posts (protected by auth)
router.get("/all", auth, postController.getAllPosts);

// Route for getting limited posts from the 'n-posts' header (protected by auth)
router.get("/limit", auth, postController.getLimitedPosts);

// Route for getting posts by 'tag' from the headers (protected by auth)
router.get("/tag", auth, postController.getPostsByTag);

// Route for getting posts by 'business' from the headers (protected by auth)
router.get("/business", auth, postController.getPostsByBusiness);

// Route for updating a post by ID (protected by auth)
router.put(
  "/:postId",
  auth,
  upload.single("resource"),
  postController.updatePost
);

// Route for deleting a post by ID (protected by auth)
router.delete("/:postId", auth, postController.deletePost);

// Route to get posts created by the logged-in user
router.get("/myposts", auth, postController.getUserPosts);

// Route for updating upvote count (protected by auth)
router.put("/:postId/upvote", auth, postController.updateUpvote);

// Route for updating downvote count (protected by auth)
router.put("/:postId/downvote", auth, postController.updateDownvote);

// Route for getting post by id
router.get("/getPost/:postId", auth, postController.getPostById);

// Route to add new comment to a post
router.put("/addComment/:postId", auth, postController.addComment);

// Route to add like to a post
router.put("/like/:postId/by/:userId", auth, postController.likePost);

module.exports = router;
