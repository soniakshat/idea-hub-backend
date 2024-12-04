// controllers/userController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register User
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const user = new User({
      name,
      email,
      password,
      department,
      is_admin: false,
      is_moderator: false,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

// Update user profile by ID
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters
    const updatedData = { ...req.body }; // Get updated profile data from request body

    // Check if the password is being updated
    if (updatedData.password) {
      // Encrypt the new password before updating
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    // Find the user by ID and update the profile
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token with user ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Send the token along with user's name and ID
    res.json({
      token,
      name: user.name,
      id: user._id,
      is_moderator: user.is_moderator,
      is_admin: user.is_admin,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters

    // Find the user by ID and exclude the password from the response
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      admin: user.is_admin,
      moderator: user.is_moderator,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

// Delete user profile by ID
exports.deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user profile", error: error.message });
  }
};

exports.toggleModeratorStatus = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        is_moderator: null,
        message: "Fail: User not found",
      });
    }

    // Toggle the is_moderator status
    user.is_moderator = !user.is_moderator;

    // Save the updated user
    await user.save();

    res.status(200).json({
      is_moderator: user.is_moderator,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      is_moderator: null,
      message: `Fail: ${error.message}`,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding passwords
    const users = await User.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
