// controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
// Register a new user
exports.registerUser = async (req, res) => {
  try {
        const { name, email, password, department } = req.body;
        const user = new User({ name, email, password, department });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with user ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    // Send the token along with user's name and ID
    res.json({
      token,
      name: user.name,
      id: user._id,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

  
// Update user profile by ID
exports.updateUserProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from request parameters
      const updatedData = req.body; // Get updated profile data from request body
  
      // Find the user by ID and update the profile
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  };
  // Get user profile by ID
exports.getUserProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from request parameters
  
      // Find the user by ID and exclude the password from the response
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  };  

  // Delete user profile by ID
exports.deleteUserProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from request parameters
  
      // Find and delete the user by ID
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user profile', error: error.message });
    }
  };  
