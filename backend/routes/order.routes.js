const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticateToken } = require("../middlewares/userAuth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get current user's order basket
router.get("/basket", orderController.getOrderBasket);

// Add item to basket
router.post("/basket/add", orderController.addToBasket);

// Remove item from basket
router.delete("/basket/item/:itemId", orderController.removeFromBasket);

// Update item quantity
router.patch("/basket/item/:itemId", orderController.updateItemQuantity);

// Clear basket
router.delete("/basket/clear", orderController.clearBasket);

// Proceed to checkout
router.post("/checkout", orderController.checkout);

// Get order history for current user
router.get("/history", orderController.getOrderHistory);

// Get orders received by farmer
router.get("/received", orderController.getReceivedOrders);

// Update order status (for farmers)
router.patch("/:orderId/status", orderController.updateOrderStatus);

// Get order details by ID
router.get("/:orderId", orderController.getOrderDetails);

module.exports = router;
