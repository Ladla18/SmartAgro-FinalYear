const SourcedProduct = require("../models/sourcedProduct.model");
const Marketplace = require("../models/marketplace.model");
const mongoose = require("mongoose");

// Add a product to a buyer's sourced products list
exports.sourceProduct = async (req, res) => {
  try {
    const { listingId } = req.body;

    console.log("Source Product Request:", {
      body: req.body,
      user: req.user,
      listingId,
    });

    if (!listingId) {
      return res.status(400).json({ message: "Listing ID is required" });
    }

    // Get buyer ID from authenticated user
    const buyerId = req.user.userId;
    console.log("Buyer ID from request:", buyerId);

    // Make sure buyerId is not undefined
    if (!buyerId) {
      return res.status(400).json({ message: "Invalid buyer ID in token" });
    }

    // Check if the listing exists
    const listing = await Marketplace.findById(listingId);
    console.log(
      "Found listing:",
      listing ? "Yes" : "No",
      listing ? listing._id : "N/A"
    );

    if (!listing) {
      return res.status(404).json({ message: "Marketplace listing not found" });
    }

    // Check if it's already sourced by this buyer
    const existing = await SourcedProduct.findOne({
      buyerId,
      listingId,
    });

    console.log("Existing sourced product:", existing ? "Yes" : "No");

    if (existing) {
      return res.status(400).json({ message: "Product is already sourced" });
    }

    // Create a new sourced product entry
    console.log("Creating new sourced product with:", {
      buyerId,
      listingId,
      cropId: listing.cropId,
    });

    const sourcedProduct = new SourcedProduct({
      buyerId,
      listingId,
      cropId: listing.cropId,
    });

    await sourcedProduct.save();
    console.log("Sourced product saved successfully:", sourcedProduct._id);

    return res.status(201).json({
      message: "Product successfully sourced",
      sourcedProduct,
    });
  } catch (error) {
    console.error("DETAILED Error in sourceProduct:", error);
    // Additional error details
    if (error.name === "ValidationError") {
      console.error("Validation error details:", error.errors);
    }
    if (error.name === "CastError") {
      console.error("Cast error details:", {
        value: error.value,
        path: error.path,
      });
    }

    return res.status(500).json({
      message: "Failed to source product",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Get all sourced products for the authenticated buyer
exports.getSourcedProducts = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    // Find all sourced products for this buyer and populate related data
    const sourcedProducts = await SourcedProduct.find({ buyerId })
      .populate({
        path: "listingId",
        populate: {
          path: "sellerId",
          select: "fullName email phoneNumber", // Only get non-sensitive seller info
        },
      })
      .populate("cropId")
      .sort({ sourcedDate: -1 }); // Most recently sourced first

    return res.status(200).json(sourcedProducts);
  } catch (error) {
    console.error("Error in getSourcedProducts:", error);
    return res.status(500).json({
      message: "Failed to retrieve sourced products",
      error: error.message,
    });
  }
};

// Remove a product from sourced products
exports.removeSourcedProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID of the sourced product entry
    const buyerId = req.user.userId;

    // Make sure the sourced product belongs to this buyer
    const sourcedProduct = await SourcedProduct.findOne({
      _id: id,
      buyerId,
    });

    if (!sourcedProduct) {
      return res.status(404).json({
        message:
          "Sourced product not found or you don't have permission to remove it",
      });
    }

    // Delete the sourced product entry
    await SourcedProduct.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product removed from sourced list",
    });
  } catch (error) {
    console.error("Error in removeSourcedProduct:", error);
    return res.status(500).json({
      message: "Failed to remove sourced product",
      error: error.message,
    });
  }
};

// Update sourced product (e.g., add notes or change status)
exports.updateSourcedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, status } = req.body;
    const buyerId = req.user.userId;

    // Make sure the sourced product belongs to this buyer
    const sourcedProduct = await SourcedProduct.findOne({
      _id: id,
      buyerId,
    });

    if (!sourcedProduct) {
      return res.status(404).json({
        message:
          "Sourced product not found or you don't have permission to update it",
      });
    }

    // Update fields if provided
    if (notes !== undefined) {
      sourcedProduct.notes = notes;
    }

    if (
      status &&
      ["active", "contacted", "purchased", "archived"].includes(status)
    ) {
      sourcedProduct.status = status;
    }

    await sourcedProduct.save();

    return res.status(200).json({
      message: "Sourced product updated",
      sourcedProduct,
    });
  } catch (error) {
    console.error("Error in updateSourcedProduct:", error);
    return res.status(500).json({
      message: "Failed to update sourced product",
      error: error.message,
    });
  }
};
