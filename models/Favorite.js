const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }
  },
  { timestamps: true }   // ✅ Automatically adds createdAt & updatedAt
);

// ✅ Compound index to prevent duplicate favorites
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

// ✅ Improve query performance with individual indexes
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ product: 1 });

module.exports = mongoose.model("Favorite", favoriteSchema);
