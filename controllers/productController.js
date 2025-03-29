const Product = require("../models/Product");
const mongoose = require("mongoose");

// ✅ Get All Products with Pagination & Sorting
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "createdAt";

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .sort({ [sort]: -1 })           // ✅ Sorting by specified field
      .skip((page - 1) * limit)        // ✅ Pagination logic
      .limit(limit)
      .lean();                         // ✅ Faster performance

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      totalProducts,
      page,
      limit,
      hasNextPage: page * limit < totalProducts,
      hasPrevPage: page > 1,
      products,
    });
  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Single Product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("🔥 Error fetching product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Create New Product with Validation
const createProduct = async (req, res) => {
  const { name, description, price, imageUrl, category, countInStock } = req.body;

  if (!name || !price || !imageUrl || !category || countInStock == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new Product({ 
      name, 
      description, 
      price, 
      imageUrl, 
      category, 
      countInStock 
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("🔥 Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// ✅ Update Product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("🔥 Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// ✅ Delete Product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id).lean();

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product removed", deletedProduct });
  } catch (error) {
    console.error("🔥 Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// ✅ Export All Functions Properly
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
