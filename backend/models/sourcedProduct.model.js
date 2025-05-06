const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sourcedProductSchema = new Schema(
  {
    // The buyer who sourced the product
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The marketplace listing that was sourced
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Marketplace",
      required: true,
    },
    // The crop referenced by the listing (for easier querying)
    cropId: {
      type: Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    // When the product was sourced
    sourcedDate: {
      type: Date,
      default: Date.now,
    },
    // Optional notes the buyer can add about this sourced product
    notes: {
      type: String,
    },
    // Status of the sourced product (for potential future workflow)
    status: {
      type: String,
      enum: ["active", "contacted", "purchased", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create a compound index for buyerId and listingId to ensure a buyer can only source a listing once
sourcedProductSchema.index({ buyerId: 1, listingId: 1 }, { unique: true });

const SourcedProduct = mongoose.model("SourcedProduct", sourcedProductSchema);

module.exports = SourcedProduct;
