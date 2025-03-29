const Cart = require("../models/Cart");

// ✅ Add to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product ID or quantity" });
  }

  try {
    // ✅ Check if the product is already in the cart
    const cartItem = await Cart.findOne({ user: req.user.id, product: productId });

    if (cartItem) {
      // ✅ Increment quantity if item exists
      cartItem.quantity += quantity;
      await cartItem.save();

      const populatedCartItem = await cartItem.populate("product").execPopulate();
      
      return res.status(200).json(populatedCartItem);
    }

    // ✅ Create a new cart item
    const newItem = new Cart({
      user: req.user.id,
      product: productId,
      quantity
    });

    await newItem.save();
    const populatedNewItem = await newItem.populate("product").execPopulate();

    res.status(201).json(populatedNewItem);

  } catch (error) {
    console.error("🔥 Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Remove from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const deleted = await Cart.findOneAndDelete({
      user: req.user.id,
      product: productId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Removed from cart" });

  } catch (error) {
    console.error("🔥 Error removing from cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all cart items
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id })
      .populate("product")  // ✅ Populate product details
      .exec();

    if (!cart.length) {
      return res.status(404).json({ message: "No items in cart" });
    }

    res.status(200).json(cart);

  } catch (error) {
    console.error("🔥 Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToCart, removeFromCart, getCart };
