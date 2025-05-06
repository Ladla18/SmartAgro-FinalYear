const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware function
const authenticateUser = (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      _id: decoded.userId, // Add _id for compatibility
      userType: decoded.userType,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Optional: Middleware to check if user is a farmer
const isFarmer = (req, res, next) => {
  if (req.user && req.user.userType === "farmer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Farmers only." });
  }
};

// Optional: Middleware to check if user is a buyer
const isBuyer = (req, res, next) => {
  if (req.user && req.user.userType === "buyer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Buyers only." });
  }
};

// Export as objects with individual functions and as direct functions
module.exports = {
  authenticateUser,
  isFarmer,
  isBuyer,
};
