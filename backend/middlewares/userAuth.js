const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
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

module.exports = {
  authenticateToken,
  isFarmer,
  isBuyer,
};
