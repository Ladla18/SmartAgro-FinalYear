const express = require("express");
const router = express.Router();
const diseaseHistoryController = require("../controllers/diseaseHistory.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// Apply authentication to individual routes instead of using router.use
// Save disease detection result (with optional image upload)
router.post(
  "/save",
  authenticateUser,
  uploadMiddleware.single("image"),
  diseaseHistoryController.saveDiseaseHistory
);

// Get user's disease history
router.get(
  "/",
  authenticateUser,
  diseaseHistoryController.getUserDiseaseHistory
);

// Get a specific history entry
router.get(
  "/:historyId",
  authenticateUser,
  diseaseHistoryController.getDiseaseHistoryById
);

// Delete a history entry
router.delete(
  "/:historyId",
  authenticateUser,
  diseaseHistoryController.deleteDiseaseHistory
);

module.exports = router;
