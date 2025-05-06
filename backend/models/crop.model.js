const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cropSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cropName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["kg", "ton", "pound", "bushel"],
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  organic: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["available", "sold", "reserved"],
    default: "available",
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Crop = mongoose.model("Crop", cropSchema);

module.exports = Crop;
