const mongoose = require("mongoose");

// ✅ Export it with the same name
const isValidObjectId = (req, res, next) => {
  const id = req.params.id || req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid ID format" });
  }

  next();
};

// ✅ Export using the correct name
module.exports = { isValidObjectId };
