const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isValidObjectId } = require("../middleware/validateObjectId");

// ✅ Correct Import from Controller
const cartController = require("../controllers/cartController");

const addToCart = cartController.addToCart;
const getCart = cartController.getCart;
const removeFromCart = cartController.removeFromCart;

console.log({ addToCart, getCart, removeFromCart });


// ✅ Log controllers for debugging
console.log({ addToCart, getCart, removeFromCart });

// ✅ Add to Cart
router.post("/:productId", protect, isValidObjectId, addToCart);

// ✅ Get Cart
router.get("/", protect, getCart);

// ✅ Remove from Cart
router.delete("/:productId", protect, isValidObjectId, removeFromCart);

module.exports = router;
