const router = require("express").Router();
const sourcedProductController = require("../controllers/sourcedProduct.controller");
const { authenticateToken, isBuyer } = require("../middlewares/userAuth");

// Test route - doesn't require buyer middleware
router.get("/test", authenticateToken, (req, res) => {
  try {
    console.log("Test route accessed with user:", req.user);
    res.status(200).json({
      message: "Test route works",
      user: req.user,
      tokenFormat:
        "Note: Your token has 'userId', not '_id'. Use req.user.userId in controllers.",
    });
  } catch (error) {
    res.status(500).json({ message: "Test route error", error: error.message });
  }
});

// Apply auth middleware to all routes - all require authentication
router.use(authenticateToken);

// Apply buyer middleware - these routes are buyer-specific
router.use(isBuyer);

// Source a product
router.post("/", sourcedProductController.sourceProduct);

// Get all sourced products for the authenticated buyer
router.get("/", sourcedProductController.getSourcedProducts);

// Update a sourced product (e.g., add notes, change status)
router.patch("/:id", sourcedProductController.updateSourcedProduct);

// Remove a product from sourced list
router.delete("/:id", sourcedProductController.removeSourcedProduct);

module.exports = router;
