const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// ✅ Import Controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

// ================================
// ✅ User Routes
// ================================
// ✅ Register User
router.post("/register", registerUser);

// ✅ Login User
router.post("/login", loginUser);

// ✅ Get User Profile (Protected)
router.get("/profile", protect, getUserProfile);

// ✅ Update User Profile (Protected)
router.put("/profile", protect, updateUserProfile);

module.exports = router;
