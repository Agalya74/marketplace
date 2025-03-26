const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// ✅ Helper Functions
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// ===============================
// ✅ Register User
// ===============================
const registerUser = async (req, res) => {
  const { name, email, password, phone, avatar, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      avatar,
      address,
      favorites: [],
      cart: [],
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        favorites: user.favorites,
        cart: user.cart,
        token: generateToken(user),
      }
    });

  } catch (error) {
    console.error("🔥 Error during registration:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================
// ✅ Login User
// ===============================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        favorites: user.favorites,
        cart: user.cart,
        token: generateToken(user),
      }
    });

  } catch (error) {
    console.error("🔥 Error during login:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================
// ✅ Get User Profile
// ===============================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        favorites: user.favorites,
        cart: user.cart,
      }
    });

  } catch (error) {
    console.error("🔥 Error fetching profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================
// ✅ Update User Profile
// ===============================
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, phone, avatar, address } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        favorites: user.favorites,
        cart: user.cart,
      }
    });

  } catch (error) {
    console.error("🔥 Error updating profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================
// ✅ Export Controllers
// ===============================
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
