const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const cropController = require("../controllers/crop.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/crops");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Serve static files - This should be before the auth middleware
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Apply auth middleware to protected routes
router.use(authMiddleware);

// Add a new crop (farmer only)
router.post("/add", upload.array("images", 5), cropController.addCrop);

// Get all crops for the logged-in user (farmer)
router.get("/user-crops", cropController.getUserCrops);

// Get all available crops (for buyers)
router.get("/available", cropController.getAvailableCrops);

// Update crop status
router.patch("/update-status", cropController.updateCropStatus);

// Get all crops
router.get("/all", cropController.getAllCrops);

// Get crops by farmer ID
router.get("/farmer/:farmerId", cropController.getFarmerCrops);

// Get crop by ID
router.get("/:id", cropController.getCropById);

// Update a crop
router.put("/update/:id", upload.array("images", 5), cropController.updateCrop);

// Delete a crop
router.delete("/delete/:id", cropController.deleteCrop);

module.exports = router;
