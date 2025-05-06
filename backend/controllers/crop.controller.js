const Crop = require("../models/crop.model");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/crops");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Add a new crop
module.exports.addCrop = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      pricePerUnit,
      unit,
      harvestDate,
      description,
      location,
      organic,
    } = req.body;

    // Basic validation
    if (
      !cropName ||
      !quantity ||
      !pricePerUnit ||
      !unit ||
      !harvestDate ||
      !location
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Get image files if they exist from req.files
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `/uploads/crops/${file.filename}`);
    }

    // Create new crop
    const crop = new Crop({
      userId: req.user.userId, // From JWT auth middleware
      cropName,
      quantity: Number(quantity),
      pricePerUnit: Number(pricePerUnit),
      unit,
      harvestDate,
      description: description || "",
      location,
      organic: Boolean(organic),
      images: imageUrls,
    });

    await crop.save();

    res.status(201).json({
      message: "Crop added successfully",
      crop,
    });
  } catch (error) {
    console.error("Add crop error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all crops for a user
module.exports.getUserCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      crops,
    });
  } catch (error) {
    console.error("Get crops error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all available crops (for buyers)
module.exports.getAvailableCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ status: "available" })
      .populate("userId", "fullName phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      crops,
    });
  } catch (error) {
    console.error("Get available crops error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update crop status (e.g., mark as sold)
module.exports.updateCropStatus = async (req, res) => {
  try {
    const { cropId, status } = req.body;

    if (!cropId || !status) {
      return res
        .status(400)
        .json({ message: "Crop ID and status are required" });
    }

    // Validate status
    if (!["available", "sold", "reserved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check if crop exists and belongs to the user
    const crop = await Crop.findOne({ _id: cropId, userId: req.user.userId });
    if (!crop) {
      return res
        .status(404)
        .json({ message: "Crop not found or not authorized" });
    }

    // Update status
    crop.status = status;
    await crop.save();

    res.status(200).json({
      message: "Crop status updated successfully",
      crop,
    });
  } catch (error) {
    console.error("Update crop status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all crops
module.exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate("userId", "fullName phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      crops,
    });
  } catch (error) {
    console.error("Get all crops error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get crops by farmer ID
module.exports.getFarmerCrops = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const crops = await Crop.find({ userId: farmerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      crops,
    });
  } catch (error) {
    console.error("Get farmer crops error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get crop by ID
module.exports.getCropById = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await Crop.findById(id).populate(
      "userId",
      "fullName phoneNumber"
    );

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.status(200).json({
      crop,
    });
  } catch (error) {
    console.error("Get crop by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a crop
module.exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cropName,
      quantity,
      pricePerUnit,
      unit,
      harvestDate,
      description,
      location,
      organic,
      status,
    } = req.body;

    // Check if crop exists and belongs to the user
    const crop = await Crop.findOne({ _id: id, userId: req.user.userId });
    if (!crop) {
      return res
        .status(404)
        .json({ message: "Crop not found or not authorized" });
    }

    // Handle image uploads
    let imageUrls = [...crop.images]; // Keep existing images
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(
        (file) => `/uploads/crops/${file.filename}`
      );
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    // Update crop data
    crop.cropName = cropName || crop.cropName;
    crop.quantity = quantity ? Number(quantity) : crop.quantity;
    crop.pricePerUnit = pricePerUnit ? Number(pricePerUnit) : crop.pricePerUnit;
    crop.unit = unit || crop.unit;
    crop.harvestDate = harvestDate || crop.harvestDate;
    crop.description =
      description !== undefined ? description : crop.description;
    crop.location = location || crop.location;
    crop.organic = organic !== undefined ? Boolean(organic) : crop.organic;
    crop.status = status || crop.status;
    crop.images = imageUrls;

    await crop.save();

    res.status(200).json({
      message: "Crop updated successfully",
      crop,
    });
  } catch (error) {
    console.error("Update crop error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a crop
module.exports.deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if crop exists and belongs to the user
    const crop = await Crop.findOne({ _id: id, userId: req.user.userId });
    if (!crop) {
      return res
        .status(404)
        .json({ message: "Crop not found or not authorized" });
    }

    // Delete associated image files
    if (crop.images && crop.images.length > 0) {
      crop.images.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "..", imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    // Delete crop from database
    await Crop.findByIdAndDelete(id);

    res.status(200).json({
      message: "Crop deleted successfully",
    });
  } catch (error) {
    console.error("Delete crop error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
