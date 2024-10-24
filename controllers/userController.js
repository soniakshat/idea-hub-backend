// controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
// Register a new user
exports.registerUser = async (req, res) => {
  try {
      const { name, email, password, department } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
      const user = new User({
          name,
          email,
          password: hashedPassword,
          department
      });

      // Save user to the database
      const savedUser = await user.save();

      // Return user ID and success message in the response
      res.status(201).json({
          message: 'User created successfully 1',
          user_id: savedUser._id   // Send back the user's ID
      });
  } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
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
