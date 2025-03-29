const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addToCart,
  removeFromCart,
  getCart
} = require("../controllers/cartController");

// ✅ Add to cart
router.post("/", protect, addToCart);

// ✅ Remove from cart
router.delete("/:productId", protect, (req, res, next) => {
  if (!req.params.productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  next();  // Proceed to the removeFromCart controller if productId is valid
}, removeFromCart);

// ✅ Get all cart items
router.get("/", protect, getCart);

module.exports = router;
