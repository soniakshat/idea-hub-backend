// routes/userRoutes.js

const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUserProfile,
  toggleModeratorStatus,
  getAllUsers,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

// Route for registering and logging in users
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route for updating user profile by ID (protected by auth)
router.put("/:userId", auth, updateUserProfile);

// Route for getting all users
router.get("/getAll", getAllUsers);

// Route for fetching user profile by ID (protected by auth)
router.get("/:userId", auth, getUserProfile);

// Route for deleting user profile by ID (protected by auth)
router.delete("/:userId", auth, deleteUserProfile);

// Route for toggeling user's moderator status
router.patch("/:userId/moderator", auth, toggleModeratorStatus);

module.exports = router;
