const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// ✅ Add to Cart
const addToCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }

    const existingProduct = cart.products.find((p) =>
      p.product.equals(productId)
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(201).json({ message: "Added to cart", cart });

  } catch (error) {
    console.error("🔥 Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Cart
const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product", "name price imageUrl");

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);

  } catch (error) {
    console.error("🔥 Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove from Cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => !p.product.equals(productId)
    );

    await cart.save();
    res.status(200).json({ message: "Removed from cart", cart });

  } catch (error) {
    console.error("🔥 Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};