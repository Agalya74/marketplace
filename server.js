const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// ✅ Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cartRoutes = require("./routes/cartRoutes");

// 🔥 Load environment variables
dotenv.config();

// 🔥 Connect to MongoDB
connectDB();

const app = express();

// ================================
// ✅ Middleware
// ================================
app.use(express.json({ limit: "50mb" }));  // ✅ Handle large JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));  // ✅ Logging for development

// ✅ CORS Configuration (Local Only)
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],  // 🔥 Local only
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ================================
// ✅ Routes
// ================================
app.get("/", (req, res) => {
  res.send("🚀 API is running locally...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);

// ================================
// ✅ Error Handling Middleware
// ================================

// 🔥 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `🔍 Route Not Found: ${req.originalUrl}`,
  });
});

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ================================
// ✅ Graceful MongoDB Shutdown
// ================================
const gracefulShutdown = async (signal) => {
  console.log(`⚠️  Received ${signal}. Closing server...`);

  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// ================================
// ✅ Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
