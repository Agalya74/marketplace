const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // assuming you have a User model
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // assuming you have a Product model
    required: true,
  },
}, { timestamps: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
