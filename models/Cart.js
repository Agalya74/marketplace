const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    quantity: { 
      type: Number, 
      default: 1,
      min: 1  // ✅ Ensure valid quantity
    }
  },
  { timestamps: true }
);

// ✅ Compound index to prevent duplicate cart entries
cartSchema.index({ user: 1, product: 1 }, { unique: true });

// ✅ Improve query performance with individual indexes
cartSchema.index({ user: 1 });
cartSchema.index({ product: 1 });

module.exports = mongoose.model("Cart", cartSchema);
