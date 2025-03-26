const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {                  // ✅ User reference
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  products: [
    {
      product: {           // ✅ Product reference
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
      }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
