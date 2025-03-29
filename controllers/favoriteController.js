const Favorite = require("../models/Favorite");

// ✅ Add to favorites
const addToFavorites = async (req, res) => {
  const { userId, productId } = req.body;  // Extract userId from frontend

  if (!userId || !productId) {
    return res.status(400).json({ message: "User ID and Product ID are required" });
  }

  try {
    // ✅ Check for existing favorite entry
    const exists = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    if (exists) {
      return res.status(409).json({ message: "Already in favorites" });  // 409 Conflict status code
    }

    const favorite = new Favorite({
      user: userId,  // Use `userId` from the frontend
      product: productId,
    });

    await favorite.save();

    // ✅ Populate product details for the response
    const populatedFavorite = await favorite.populate("product").execPopulate();

    res.status(201).json(populatedFavorite);

  } catch (error) {
    console.error("🔥 Error adding to favorites:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Remove from favorites
const removeFromFavorites = async (req, res) => {
  const { userId, productId } = req.params;  // Extract both userId and productId from URL params

  if (!userId || !productId) {
    return res.status(400).json({ message: "User ID and Product ID are required" });
  }

  try {
    const deleted = await Favorite.findOneAndDelete({
      user: userId,  // Match by `userId` and `productId`
      product: productId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found for this user and product" });
    }

    res.status(200).json({ message: "Removed from favorites", productId });

  } catch (error) {
    console.error("🔥 Error removing from favorites:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all favorites for a user
const getFavorites = async (req, res) => {
  const { userId } = req.params;  // Get userId from params

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const favorites = await Favorite.find({ user: userId })  // Filter by userId
      .populate("product")  // Populate product details
      .exec();

    res.status(200).json(favorites);

  } catch (error) {
    console.error("🔥 Error fetching favorites:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToFavorites, removeFromFavorites, getFavorites };
