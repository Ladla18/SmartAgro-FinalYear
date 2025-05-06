const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Make sure JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

module.exports.signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, userType } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate userType
    if (!["farmer", "buyer"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      userType,
    });

    await user.save();

    // Generate token for immediate login after signup
    const token = jwt.sign(
      {
        userId: user._id,
        userType: user.userType,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user and validate userType
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or user type" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        userType: user.userType,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Optional: Add a route to verify token and get user data
module.exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user data error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
module.exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic info if provided
    if (fullName) {
      user.fullName = fullName;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    // Handle password change if requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
