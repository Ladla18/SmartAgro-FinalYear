const DiseaseHistory = require("../models/diseaseHistory.model");
const path = require("path");

// Save new disease detection result
const saveDiseaseHistory = async (req, res) => {
  try {
    const {
      cropName,
      disease,
      probability,
      description,
      treatments,
      secondaryPredictions,
      geminiAnalysis,
    } = req.body;

    // Ensure user is logged in
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Image URL will point to the uploaded image if available
    let imageUrl = null;
    if (req.file) {
      // Extract only the filename from the path
      const filename = req.file.filename || path.basename(req.file.path);

      // Create the relative path that points to uploads directory
      imageUrl = `uploads/${filename}`;
    }

    // Parse secondaryPredictions if it's a string
    let parsedSecondaryPredictions = secondaryPredictions;
    if (typeof secondaryPredictions === "string") {
      try {
        parsedSecondaryPredictions = JSON.parse(secondaryPredictions);
      } catch (e) {
        console.warn("Failed to parse secondaryPredictions", e);
        parsedSecondaryPredictions = []; // Fallback to empty array
      }
    }

    // Create a new disease history record
    const newHistory = new DiseaseHistory({
      userId: req.user._id,
      cropName,
      disease,
      probability,
      description,
      treatments,
      secondaryPredictions: parsedSecondaryPredictions,
      imageUrl,
      geminiAnalysis,
      timestamp: new Date(),
    });

    // Save to database
    await newHistory.save();

    return res.status(201).json({
      message: "Disease analysis saved to history",
      historyId: newHistory._id,
    });
  } catch (error) {
    console.error("Error saving disease history:", error);
    return res.status(500).json({
      message: "Failed to save disease history",
      error: error.message,
    });
  }
};

// Get disease history for the logged-in user
const getUserDiseaseHistory = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get user's disease history sorted by newest first
    const history = await DiseaseHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json({
      history,
    });
  } catch (error) {
    console.error("Error fetching disease history:", error);
    return res.status(500).json({
      message: "Failed to fetch disease history",
      error: error.message,
    });
  }
};

// Get a specific history entry by ID
const getDiseaseHistoryById = async (req, res) => {
  try {
    const { historyId } = req.params;

    // Ensure user is logged in
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the history entry that belongs to the user
    const historyEntry = await DiseaseHistory.findOne({
      _id: historyId,
      userId: req.user._id,
    }).lean();

    if (!historyEntry) {
      return res.status(404).json({
        message: "History entry not found or does not belong to you",
      });
    }

    return res.status(200).json({
      historyEntry,
    });
  } catch (error) {
    console.error("Error fetching disease history entry:", error);
    return res.status(500).json({
      message: "Failed to fetch disease history entry",
      error: error.message,
    });
  }
};

// Delete a specific history entry
const deleteDiseaseHistory = async (req, res) => {
  try {
    const { historyId } = req.params;

    // Ensure user is logged in
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find and delete the history entry that belongs to the user
    const result = await DiseaseHistory.deleteOne({
      _id: historyId,
      userId: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "History entry not found or does not belong to you",
      });
    }

    return res.status(200).json({
      message: "Disease history entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting disease history:", error);
    return res.status(500).json({
      message: "Failed to delete disease history",
      error: error.message,
    });
  }
};

module.exports = {
  saveDiseaseHistory,
  getUserDiseaseHistory,
  getDiseaseHistoryById,
  deleteDiseaseHistory,
};
