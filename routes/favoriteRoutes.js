const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// ✅ Import the controller functions
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

// ✅ Add product to favorites
router.post("/", protect, addFavorite);

// ✅ Get all favorite products (NO userId in the route)
router.get("/", protect, getFavorites);

// ✅ Remove product from favorites
router.delete("/:productId", protect, removeFavorite);

module.exports = router;
