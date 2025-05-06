const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cropDiseaseController = require("../controllers/cropDiseaseController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/crop-diseases"));
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "crop-disease-" + uniqueSuffix + ext);
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads/crop-diseases");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define routes
router.post("/initialize", cropDiseaseController.initializeModel);
router.get("/status", cropDiseaseController.getModelStatus);
router.post(
  "/analyze",
  upload.single("image"),
  cropDiseaseController.analyzeCropDisease
);

module.exports = router;
