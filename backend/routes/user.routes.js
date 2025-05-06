const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected route - requires authentication
router.get("/me", authMiddleware, userController.getUserData);
router.put("/update-profile", authMiddleware, userController.updateUserProfile);

module.exports = router;
