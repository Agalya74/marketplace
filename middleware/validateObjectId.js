const mongoose = require("mongoose");

// ✅ Middleware to Validate Object ID
const isValidObjectId = (req, res, next) => {
  // 🔥 Support multiple ID sources (params & body)
  const id = req.params.id || req.params.productId || req.body.id;

  // ✅ Check if ID is provided
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid ID format" });
  }

  next();
};

// ✅ Export Middleware
module.exports = { isValidObjectId };
