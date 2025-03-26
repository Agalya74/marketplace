const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// ✅ Correct Import from Controller
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ================================
// ✅ Routes
// ================================
// ✅ Get all products
router.get("/", getProducts);                     

// ✅ Get product by ID (validate in the controller)
router.get("/:id", getProductById);                

// ✅ Create a new product (protected route)
router.post("/", protect, createProduct);          

// ✅ Update product by ID (protected route)
router.put("/:id", protect, updateProduct);        

// ✅ Delete product by ID (protected route)
router.delete("/:id", protect, deleteProduct);     

module.exports = router;
