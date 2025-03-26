const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      set: v => parseFloat(v.toFixed(2))
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Books", "Furniture"],
      index: true
    },
    imageUrl: {
      type: String,
      required: true,
      default: "/images/placeholder.jpg",
      validate: {
        validator: function (v) {
          return /^(https?:\/\/.*)/.test(v);
        },
        message: "Invalid image URL format"
      }
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.index({ name: 1, category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
