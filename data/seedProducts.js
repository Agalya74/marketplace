require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");  // ✅ Use the correct model name

// ✅ Connect to MongoDB
const seedProducts = async () => {
  try {
    await connectDB();  // Use external DB config

    // ✅ Clear previous data
    await Product.deleteMany();
    console.log("🔥 Previous products deleted");

    // ✅ Insert new data
    const insertedProducts = await Product.insertMany([
      {
        name: "Smartphone",
        description: "High-end smartphone with latest features",
        price: 999,
        category: "Electronics",
        imageUrl: "https://via.placeholder.com/300",
        countInStock: 20,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: "Leather Jacket",
        description: "Stylish leather jacket for all seasons",
        price: 199,
        category: "Clothing",
        imageUrl: "https://via.placeholder.com/300",
        countInStock: 15,
        rating: 4.0,
        numReviews: 8,
      },
      {
        name: "Data Science Book",
        description: "Comprehensive guide on data science",
        price: 49,
        category: "Books",
        imageUrl: "https://via.placeholder.com/300",
        countInStock: 30,
        rating: 4.8,
        numReviews: 22,
      },
      {
        name: "Wooden Chair",
        description: "Comfortable and stylish wooden chair",
        price: 89,
        category: "Furniture",
        imageUrl: "https://via.placeholder.com/300",
        countInStock: 10,
        rating: 4.2,
        numReviews: 5,
      }
    ]);

    console.log(`✅ ${insertedProducts.length} products seeded successfully`);

  } catch (error) {
    console.error(`❌ Error seeding products: ${error.message}`);
    console.error(error.stack);

  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

// ✅ Run the seeder
seedProducts();
