// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

process.title = "ideahub-server";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Initialize Express
const app = express();

// Setup Cors
const cors = require('cors');

// app.use(cors());
// Configure CORS middleware
app.use(cors({
  origin: '*', // Allow all origins temporarily
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If using cookies or HTTP authentication
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(204); // Respond with no content
});

// Middleware to parse JSON bodies
app.use(express.json());

// Use the post routes
app.use('/api/posts', postRoutes);

// Use the auth routes
app.use('/user', userRoutes);

// Start the server
if (process.env.PORT == "" || process.env.PORT == null)
{
  console.error("No port set in env. Exiting the process...");
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
