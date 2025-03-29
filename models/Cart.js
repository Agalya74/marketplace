const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // ✅ User reference with indexing
    user: {                  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true 
    },

    // ✅ Product details in the cart
    products: [
      {
        product: {           
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          index: true
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"],
          max: [100, "Quantity cannot exceed 100"],
        }
      }
    ],
  },
  { timestamps: true }  // ✅ Automatic timestamps
);

// ✅ Create compound index for efficient cart lookups
cartSchema.index({ user: 1, "products.product": 1 });

module.exports = mongoose.model("Cart", cartSchema);
