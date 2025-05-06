const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplace.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(authMiddleware);

// List a crop in the marketplace
router.post("/list", marketplaceController.listCrop);

// Remove a crop from the marketplace
router.delete("/remove/:cropId", marketplaceController.removeListing);

// Get all active marketplace listings
router.get("/active", marketplaceController.getActiveListings);

// Get my listings
router.get("/my-listings", marketplaceController.getMyListings);

module.exports = router;
