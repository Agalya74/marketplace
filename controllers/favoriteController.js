const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// ✅ Add product to favorites
const addFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. No token provided" });
    }

    const { productId } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      product: productId,
    }).lean();

    if (existingFavorite) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    const newFavorite = await Favorite.create({
      user: req.user.id,
      product: productId,
    });

    res.status(201).json({ message: "Added to favorites", favorite: newFavorite });
  } catch (error) {
    console.error("🔥 Error adding favorite:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all favorite products
const getFavorites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. No token provided" });
    }

    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: "product",
        select: "name price imageUrl",
      })
      .lean();

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({ message: "No favorites found" });
    }

    const products = favorites.map((fav) => ({
      _id: fav.product._id,
      name: fav.product.name,
      price: fav.product.price,
      imageUrl: fav.product.imageUrl,
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("🔥 Error getting favorites:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Remove product from favorites
const removeFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. No token provided" });
    }

    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      product: productId,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("🔥 Error removing favorite:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
