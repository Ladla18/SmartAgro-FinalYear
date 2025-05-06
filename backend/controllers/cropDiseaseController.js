const cropDiseaseService = require("../services/cropDiseaseService");
const path = require("path");
const fs = require("fs");

// Initialize model when the server starts
let modelInitialized = false;

// Initialize the model
const initializeModel = async (req, res) => {
  try {
    if (modelInitialized) {
      return res.status(200).json({
        message: "Model already initialized",
        status: cropDiseaseService.getModelStatus(),
      });
    }

    const result = await cropDiseaseService.initializeModel();
    modelInitialized = result.modelLoaded;

    return res.status(200).json({
      message: "Model initialized successfully",
      status: result,
    });
  } catch (error) {
    console.error("Error initializing model:", error);
    return res.status(500).json({
      message: "Failed to initialize model",
      error: error.message,
    });
  }
};

// Get model status
const getModelStatus = (req, res) => {
  try {
    const status = cropDiseaseService.getModelStatus();
    return res.status(200).json({ status });
  } catch (error) {
    console.error("Error getting model status:", error);
    return res.status(500).json({
      message: "Failed to get model status",
      error: error.message,
    });
  }
};

// Analyze crop disease from uploaded image
const analyzeCropDisease = async (req, res) => {
  try {
    // Check if model is initialized
    if (!modelInitialized) {
      return res.status(400).json({
        message: "Model not initialized. Please initialize model first.",
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Get the file path of the uploaded image
    const imagePath = req.file.path;

    // Analyze the crop disease
    const result = await cropDiseaseService.analyzeCropDisease(imagePath);

    // Check if there's a validation error (non-crop image)
    if (result.error && result.validationFailed) {
      return res.status(400).json({
        message: result.message,
        error: "VALIDATION_FAILED",
        validationFailed: true,
      });
    }

    return res.status(200).json({
      message: "Analysis completed successfully",
      result,
    });
  } catch (error) {
    console.error("Error analyzing crop disease:", error);
    return res.status(500).json({
      message: "Failed to analyze crop disease",
      error: error.message,
    });
  }
};

module.exports = {
  initializeModel,
  getModelStatus,
  analyzeCropDisease,
};
