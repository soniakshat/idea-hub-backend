// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Check if Authorization header is present
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Remove 'Bearer ' from token
    const cleanToken = token.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // Attach user info to request after decoding
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
