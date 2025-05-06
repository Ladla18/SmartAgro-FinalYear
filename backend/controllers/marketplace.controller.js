const Marketplace = require("../models/marketplace.model");
const Crop = require("../models/crop.model");

// List a crop in the marketplace
module.exports.listCrop = async (req, res) => {
  try {
    const { cropId, minOrderQuantity, notes, contactPreference, negotiable } =
      req.body;

    // Verify crop exists and belongs to user
    const crop = await Crop.findOne({ _id: cropId, userId: req.user.userId });
    if (!crop) {
      return res
        .status(404)
        .json({
          message: "Crop not found or you don't have permission to list it",
        });
    }

    // Check if crop is already listed
    const existingListing = await Marketplace.findOne({
      cropId,
      sellerId: req.user.userId,
    });
    if (existingListing) {
      // Update the existing listing
      existingListing.isActive = true;
      existingListing.minOrderQuantity =
        minOrderQuantity || existingListing.minOrderQuantity;
      existingListing.notes = notes || existingListing.notes;
      existingListing.contactPreference =
        contactPreference || existingListing.contactPreference;
      existingListing.negotiable =
        negotiable !== undefined ? negotiable : existingListing.negotiable;

      await existingListing.save();

      return res.status(200).json({
        message: "Crop listing updated in marketplace",
        listing: existingListing,
      });
    }

    // Create new listing
    const listing = new Marketplace({
      cropId,
      sellerId: req.user.userId,
      minOrderQuantity: minOrderQuantity || 1,
      notes,
      contactPreference: contactPreference || "both",
      negotiable: negotiable !== undefined ? negotiable : true,
    });

    await listing.save();

    // Make sure the crop is marked as available
    if (crop.status !== "available") {
      crop.status = "available";
      await crop.save();
    }

    res.status(201).json({
      message: "Crop listed in marketplace successfully",
      listing,
    });
  } catch (error) {
    console.error("List crop in marketplace error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a crop from the marketplace
module.exports.removeListing = async (req, res) => {
  try {
    const { cropId } = req.params;

    // Find and update the listing (set to inactive)
    const listing = await Marketplace.findOne({
      cropId,
      sellerId: req.user.userId,
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.isActive = false;
    await listing.save();

    res.status(200).json({
      message: "Crop removed from marketplace successfully",
    });
  } catch (error) {
    console.error("Remove marketplace listing error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all active marketplace listings
module.exports.getActiveListings = async (req, res) => {
  console.log("Get active listings");
  try {
    const listings = await Marketplace.find({ isActive: true })
      .populate({
        path: "cropId",
        populate: {
          path: "userId",
          select: "fullName phoneNumber",
        },
      })
      .populate("sellerId", "fullName phoneNumber")
      .sort({ listingDate: -1 });

    res.status(200).json({
      listings,
    });
  } catch (error) {
    console.error("Get marketplace listings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get my listings
module.exports.getMyListings = async (req, res) => {
  try {
    const listings = await Marketplace.find({ sellerId: req.user.userId })
      .populate("cropId")
      .sort({ listingDate: -1 });

    res.status(200).json({
      listings,
    });
  } catch (error) {
    console.error("Get my listings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
