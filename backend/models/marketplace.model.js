const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketplaceSchema = new Schema({
  cropId: {
    type: Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listingDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featuredListing: {
    type: Boolean,
    default: false,
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
  },
  notes: {
    type: String,
  },
  contactPreference: {
    type: String,
    enum: ["email", "phone", "both"],
    default: "both",
  },
  negotiable: {
    type: Boolean,
    default: true,
  },
});

// Create a compound index for sellerId and cropId to ensure uniqueness
marketplaceSchema.index({ sellerId: 1, cropId: 1 }, { unique: true });

const Marketplace = mongoose.model("Marketplace", marketplaceSchema);

module.exports = Marketplace;
