const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { authenticateToken } = require("../middlewares/userAuth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all conversations for the current user
router.get("/conversations", chatController.getConversations);

// Get chat history with a specific user
router.get("/history/:recipientId", chatController.getChatHistory);

// Send a message to another user
router.post("/send", chatController.sendMessage);

// Send a quotation request
router.post("/quotation", chatController.sendQuotation);

// Mark messages as read
router.patch("/mark-read/:conversationId", chatController.markAsRead);

module.exports = router;
