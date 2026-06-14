# Idea Hub Backend

A Node.js and Express RESTful API for **Idea Hub**, a platform designed for sharing, discussing, and voting on creative ideas and business proposals. The project leverages MongoDB as its database, Mongoose for object modeling, and JSON Web Tokens (JWT) for secure authentication.

---

## 🚀 Key Features

- **User Authentication & Management**: 
  - User registration and login.
  - Secure password hashing using `bcryptjs`.
  - Stateless authentication with JSON Web Tokens (JWT).
  - Profile management (Retrieve, Update, and Delete profile).
- **Idea/Post Management**:
  - Create, read, update, and delete (CRUD) posts.
  - Filter posts by custom headers (e.g., limit output via `n-posts`, or filter by `tag` and `business` domain).
  - Retrieve posts authored by the logged-in user.
- **Interactive Voting System**:
  - Real-time upvoting and downvoting on ideas.
- **Nested Comments**:
  - Structured MongoDB document schema supporting nested comments under each idea.
- **Security & Middleware**:
  - Cross-Origin Resource Sharing (CORS) preflight and configuration enabled.
  - Custom JWT authentication middleware (`authMiddleware`) to protect private endpoints.

---

## 📁 Repository Structure

```text
idea-hub-backend/
├── config/
│   └── db.js                 # Database connection configuration helper (currently unused)
├── controllers/
│   ├── postController.js     # Request handling logic for Posts (Create, Get, Filter, Update, Delete, Vote)
│   └── userController.js     # Request handling logic for Users (Register, Login, Profile CRUD)
├── middlewares/
│   └── authMiddleware.js     # Middleware to verify JWT and attach user context to incoming requests
├── models/
│   ├── Post.js               # Mongoose schema defining the Post and nested Comment structure
│   └── User.js               # Mongoose schema defining the User structure and password hashing middleware
├── routes/
│   ├── postRoutes.js         # Defines Express routes under /api/posts mapped to postController
│   └── userRoutes.js         # Defines Express routes under /user mapped to userController
├── .gitignore                # Rules for excluding files from Git tracking
├── package-lock.json         # Pinned npm dependencies lock file
├── package.json              # Project description, start scripts, and package manifests
└── server.js                 # Core entry point; bootstraps connection to database, configs, and starts server
```

---

## 🛠️ Prerequisites

Before setting up the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager, bundle-installed with Node)
- [MongoDB](https://www.mongodb.com/) (A local MongoDB Community Edition instance running, or a MongoDB Atlas cloud database URI)

---

## ⚙️ Installation & Setup

Follow these steps to run the backend on your local environment:

### 1. Clone the Repository
```bash
git clone https://github.com/soniakshat/idea-hub-backend.git
cd idea-hub-backend
```

### 2. Install Dependencies
Install all required Node modules specified in `package.json`:
```bash
npm install
```

### 3. Environment Configurations
Create a `.env` file in the root directory and add the following configuration variables:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/ideahub
JWT_SECRET=your_super_secret_jwt_key
```

*Note: Replace `MONGO_URI` with your MongoDB Atlas connection string if hosting online, and choose a strong key for `JWT_SECRET`.*

---

## 🏃 How to Run

### Development Mode (with Hot Reloading)
Launches the server with `nodemon` to watch for changes and automatically restart the application:
```bash
npm run dev
```
*(If `dev` is not defined in `package.json`, you can launch it manually using `npx nodemon server.js` or standard `node server.js`)*

### Production Mode
Launches the server with standard Node runtime:
```bash
node server.js
```

Once running successfully, you should see console logs resembling:
```text
Connected to MongoDB
Server running on port 5001
```

---

## 🧪 Running Tests

Currently, this repository does not include unit or integration test suites. Running:
```bash
npm test
```
will output:
```text
Error: no test specified
```
*Contributions or pull requests to integrate testing frameworks (like Jest, Supertest, or Mocha) are highly welcomed.*

---

## 🔌 API Endpoints Summary

### User & Authentication (`/user`)
- `POST /user/register` - Register a new user
- `POST /user/login` - Login to account (returns token, name, and ID)
- `GET /user/:userId` - Retrieve profile info `(Protected)`
- `PUT /user/:userId` - Update profile details `(Protected)`
- `DELETE /user/:userId` - Delete profile `(Protected)`

### Ideas & Posts (`/api/posts`)
- `POST /api/posts/` - Create a new post `(Protected)`
- `GET /api/posts/all` - Get all posts `(Protected)`
- `GET /api/posts/myposts?userId=ID` - Get posts created by specific user `(Protected)`
- `GET /api/posts/limit` - Get limited number of posts (requires `n-posts` in request headers) `(Protected)`
- `GET /api/posts/tag` - Filter posts by tag (requires `tag` in request headers) `(Protected)`
- `GET /api/posts/business` - Filter posts by business (requires `business` in request headers) `(Protected)`
- `PUT /api/posts/:postId` - Update a post `(Protected)`
- `DELETE /api/posts/:postId` - Delete a post `(Protected)`
- `PUT /api/posts/:postId/upvote` - Increment/decrement upvotes (requires `increment` in body) `(Protected)`
- `PUT /api/posts/:postId/downvote` - Increment/decrement downvotes (requires `increment` in body) `(Protected)`
