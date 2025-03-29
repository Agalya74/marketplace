const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Helper Function for Token Generation
const generateToken = (user) => {
  try {
    return jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
  } catch (error) {
    console.error("🔥 JWT Token Generation Failed:", error);
    return null;  // Return null if token generation fails
  }
};

// ===============================
// ✅ Register User
// ===============================
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("✅ User created successfully:", user);

    // ✅ Token generation
    const token = generateToken(user);
    
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("🔥 Server Error during registration:", error.message);
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

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("🔥 Server Error during login:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================
// ✅ Get User Profile
// ===============================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user
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

    const { name, email, password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("🔥 Error updating profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Export Controllers
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
