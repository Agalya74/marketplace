const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} = require("../controllers/favoriteController");

// ✅ Add to favorites with `userId`
router.post("/", protect, addToFavorites);

// ✅ Remove from favorites with `userId` in the URL
router.delete("/:userId/:productId", protect, removeFromFavorites);

// ✅ Get all favorites for a user
router.get("/:userId", protect, getFavorites);

module.exports = router;
