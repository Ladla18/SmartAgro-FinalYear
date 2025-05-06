const mongoose = require("mongoose");

const diseaseHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    probability: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    treatments: [
      {
        type: String,
      },
    ],
    secondaryPredictions: [
      {
        cropName: String,
        disease: String,
        probability: Number,
      },
    ],
    imageUrl: {
      type: String,
    },
    geminiAnalysis: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const DiseaseHistory = mongoose.model("DiseaseHistory", diseaseHistorySchema);

module.exports = DiseaseHistory;
