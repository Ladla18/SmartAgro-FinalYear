const OrderBasket = require("../models/order.model");
const Crop = require("../models/crop.model");
const Marketplace = require("../models/marketplace.model");
const mongoose = require("mongoose");

// Get the current user's order basket
module.exports.getOrderBasket = async (req, res) => {
  try {
    let orderBasket = await OrderBasket.findOne({
      userId: req.user.userId,
      status: "active",
    })
      .populate({
        path: "items.cropId",
        select: "cropName images",
      })
      .populate({
        path: "items.listingId",
        select: "sellerId",
        populate: {
          path: "sellerId",
          select: "fullName",
        },
      });

    if (!orderBasket) {
      // Create a new order basket if none exists
      orderBasket = new OrderBasket({
        userId: req.user.userId,
        items: [],
        total: 0,
      });
      await orderBasket.save();
    }

    res.status(200).json({
      orderBasket,
    });
  } catch (error) {
    console.error("Get order basket error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add an item to the order basket
module.exports.addToBasket = async (req, res) => {
  try {
    const { listingId, quantity } = req.body;

    if (!listingId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Listing ID and a positive quantity are required",
      });
    }

    // Find the listing
    const listing = await Marketplace.findById(listingId).populate("cropId");
    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: "Listing not found or inactive" });
    }

    // Check if quantity is available
    const crop = listing.cropId;
    if (!crop || crop.quantity < quantity) {
      return res.status(400).json({
        message: "Requested quantity not available",
      });
    }

    // Check if the minimum order quantity is met
    if (quantity < listing.minOrderQuantity) {
      return res.status(400).json({
        message: `Minimum order quantity is ${listing.minOrderQuantity} ${crop.unit}`,
      });
    }

    // Find or create the user's active order basket
    let orderBasket = await OrderBasket.findOne({
      userId: req.user.userId,
      status: "active",
    });

    if (!orderBasket) {
      orderBasket = new OrderBasket({
        userId: req.user.userId,
        items: [],
        total: 0,
      });
    }

    // Calculate subtotal
    const subtotal = crop.pricePerUnit * quantity;

    // Check if item already exists in basket
    const existingItemIndex = orderBasket.items.findIndex(
      (item) => item.listingId.toString() === listingId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      orderBasket.items[existingItemIndex].quantity = quantity;
      orderBasket.items[existingItemIndex].subtotal = subtotal;
    } else {
      // Add new item
      orderBasket.items.push({
        cropId: crop._id,
        listingId,
        sellerId: listing.sellerId,
        quantity,
        pricePerUnit: crop.pricePerUnit,
        unit: crop.unit,
        subtotal,
      });
    }

    // Recalculate total
    orderBasket.calculateTotal();
    orderBasket.updatedAt = Date.now();

    await orderBasket.save();

    // Return the updated basket
    const populatedBasket = await OrderBasket.findById(orderBasket._id)
      .populate({
        path: "items.cropId",
        select: "cropName images",
      })
      .populate({
        path: "items.listingId",
        select: "sellerId",
        populate: {
          path: "sellerId",
          select: "fullName",
        },
      });

    res.status(200).json({
      message: "Item added to basket",
      orderBasket: populatedBasket,
    });
  } catch (error) {
    console.error("Add to basket error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove an item from the order basket
module.exports.removeFromBasket = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    // Find the user's active order basket
    const orderBasket = await OrderBasket.findOne({
      userId: req.user.userId,
      status: "active",
    });

    if (!orderBasket) {
      return res.status(404).json({ message: "Order basket not found" });
    }

    // Remove the item
    orderBasket.items = orderBasket.items.filter(
      (item) => item._id.toString() !== itemId
    );

    // Recalculate total
    orderBasket.calculateTotal();
    orderBasket.updatedAt = Date.now();

    await orderBasket.save();

    res.status(200).json({
      message: "Item removed from basket",
      orderBasket,
    });
  } catch (error) {
    console.error("Remove from basket error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update item quantity in the basket
module.exports.updateItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Item ID and a positive quantity are required",
      });
    }

    // Find the user's active order basket
    const orderBasket = await OrderBasket.findOne({
      userId: req.user.userId,
      status: "active",
    });

    if (!orderBasket) {
      return res.status(404).json({ message: "Order basket not found" });
    }

    // Find the item
    const itemIndex = orderBasket.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in basket" });
    }

    // Update the item
    const item = orderBasket.items[itemIndex];

    // Check if the listing still exists and has enough quantity
    const listing = await Marketplace.findById(item.listingId).populate(
      "cropId"
    );
    if (!listing || !listing.isActive) {
      return res
        .status(400)
        .json({ message: "Listing is no longer available" });
    }

    const crop = listing.cropId;
    if (!crop || crop.quantity < quantity) {
      return res.status(400).json({
        message: "Requested quantity not available",
      });
    }

    // Check if the minimum order quantity is met
    if (quantity < listing.minOrderQuantity) {
      return res.status(400).json({
        message: `Minimum order quantity is ${listing.minOrderQuantity} ${crop.unit}`,
      });
    }

    // Update quantity and subtotal
    item.quantity = quantity;
    item.subtotal = item.pricePerUnit * quantity;

    // Recalculate total
    orderBasket.calculateTotal();
    orderBasket.updatedAt = Date.now();

    await orderBasket.save();

    res.status(200).json({
      message: "Item quantity updated",
      orderBasket,
    });
  } catch (error) {
    console.error("Update item quantity error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Proceed to checkout
module.exports.checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Shipping address and payment method are required",
      });
    }

    // Find the user's active order basket
    const orderBasket = await OrderBasket.findOne({
      userId: req.user.userId,
      status: "active",
    });

    if (!orderBasket || orderBasket.items.length === 0) {
      return res.status(400).json({
        message: "Order basket is empty or not found",
      });
    }

    // Update order basket with checkout information
    orderBasket.shippingAddress = shippingAddress;
    orderBasket.paymentMethod = paymentMethod;
    orderBasket.notes = notes || "";
    orderBasket.status = "checkout";
    orderBasket.updatedAt = Date.now();

    await orderBasket.save();

    res.status(200).json({
      message: "Proceeded to checkout",
      orderBasket,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear the basket
module.exports.clearBasket = async (req, res) => {
  try {
    // Find the user's active order basket
    const orderBasket = await OrderBasket.findOne({
      userId: req.user.userId,
      status: "active",
    });

    if (!orderBasket) {
      return res.status(404).json({ message: "Order basket not found" });
    }

    // Clear items and reset total
    orderBasket.items = [];
    orderBasket.total = 0;
    orderBasket.updatedAt = Date.now();

    await orderBasket.save();

    res.status(200).json({
      message: "Order basket cleared",
      orderBasket,
    });
  } catch (error) {
    console.error("Clear basket error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get order history for the current user
module.exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await OrderBasket.find({
      userId: req.user.userId,
      status: { $ne: "active" }, // Exclude active basket
    })
      .sort({ updatedAt: -1 }) // Sort by most recent
      .populate({
        path: "items.cropId",
        select: "cropName images",
      })
      .populate({
        path: "items.listingId",
        select: "sellerId",
        populate: {
          path: "sellerId",
          select: "fullName",
        },
      });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get order history error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get order details by ID
module.exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    let order;

    // If the user is a farmer, they should be able to see orders where they are a seller
    if (req.user.userType === "farmer") {
      order = await OrderBasket.findOne({
        _id: orderId,
        "items.sellerId": req.user.userId, // Farmer can see orders where they are a seller
      })
        .populate({
          path: "items.cropId",
          select: "cropName images description organic harvestDate",
        })
        .populate({
          path: "items.listingId",
          select: "sellerId",
          populate: {
            path: "sellerId",
            select: "fullName email",
          },
        })
        .populate({
          path: "userId",
          select: "fullName email phone",
        });

      // Process order to include buyer information
      if (order) {
        // Keep full order details but format buyer information
        order = order.toObject();
        order.buyerName = order.userId?.fullName || "Unknown Buyer";
        order.buyerEmail = order.userId?.email;
        order.buyerPhone = order.userId?.phone;
      }
    } else {
      // Regular user can only see their own orders
      order = await OrderBasket.findOne({
        _id: orderId,
        userId: req.user.userId,
      })
        .populate({
          path: "items.cropId",
          select: "cropName images description organic harvestDate",
        })
        .populate({
          path: "items.listingId",
          select: "sellerId",
          populate: {
            path: "sellerId",
            select: "fullName email",
          },
        });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get orders received by the farmer
module.exports.getReceivedOrders = async (req, res) => {
  try {
    // Ensure the user is a farmer
    if (req.user.userType !== "farmer") {
      return res.status(403).json({ message: "Access denied. Farmers only" });
    }

    // Find orders where this farmer is the seller of any item
    const receivedOrders = await OrderBasket.find({
      "items.sellerId": req.user.userId,
      status: { $ne: "active" }, // Exclude active baskets (not yet checked out)
    })
      .populate({
        path: "items.cropId",
        select: "cropName images quantity unit pricePerUnit",
      })
      .populate({
        path: "userId",
        select: "fullName email phone",
      })
      .sort({ updatedAt: -1 });

    // Process orders to include only the items sold by this farmer
    const processedOrders = receivedOrders.map((order) => {
      // Filter items to only those sold by this farmer
      const farmerItems = order.items.filter(
        (item) => item.sellerId && item.sellerId.toString() === req.user.userId
      );

      // Calculate total for just the farmer's items
      const farmerTotal = farmerItems.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      return {
        _id: order._id,
        buyerName: order.userId?.fullName || "Unknown Buyer",
        buyerEmail: order.userId?.email,
        buyerPhone: order.userId?.phone,
        shippingAddress: order.shippingAddress,
        status: order.status,
        items: farmerItems,
        total: farmerTotal,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    res.status(200).json({
      orders: processedOrders,
    });
  } catch (error) {
    console.error("Get received orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status (for farmers)
module.exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log(`Attempting to update order ${orderId} to status ${status}`);

    if (!orderId || !status) {
      return res.status(400).json({
        message: "Order ID and status are required",
      });
    }

    // Validate status
    const validStatuses = ["processing", "shipped", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Ensure the user is a farmer
    if (req.user.userType !== "farmer") {
      return res.status(403).json({ message: "Access denied. Farmers only" });
    }

    console.log(`Finding order with ID ${orderId}`);
    const order = await OrderBasket.findById(orderId);
    if (!order) {
      console.log(`Order with ID ${orderId} not found`);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`Order found: ${order._id}, current status: ${order.status}`);

    // Check if the farmer is a seller for this order
    const isSeller = order.items.some(
      (item) => item.sellerId && item.sellerId.toString() === req.user.userId
    );

    if (!isSeller) {
      console.log(`User ${req.user.userId} is not a seller for this order`);
      return res
        .status(403)
        .json({ message: "You are not a seller for this order" });
    }

    // Update order status
    order.status = status;
    order.updatedAt = Date.now();

    console.log(`Saving order with new status: ${status}`);
    await order.save();

    // Return the updated order with populated fields
    console.log(`Fetching updated order details`);
    const updatedOrder = await OrderBasket.findById(orderId)
      .populate({
        path: "items.cropId",
        select: "cropName images quantity unit pricePerUnit",
      })
      .populate({
        path: "userId",
        select: "fullName email phone",
      });

    // Process order to include only the items sold by this farmer
    const farmerItems = updatedOrder.items.filter(
      (item) => item.sellerId && item.sellerId.toString() === req.user.userId
    );

    const farmerTotal = farmerItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    const processedOrder = {
      _id: updatedOrder._id,
      buyerName: updatedOrder.userId?.fullName || "Unknown Buyer",
      buyerEmail: updatedOrder.userId?.email,
      buyerPhone: updatedOrder.userId?.phone,
      shippingAddress: updatedOrder.shippingAddress,
      status: updatedOrder.status,
      items: farmerItems,
      total: farmerTotal,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
    };

    console.log(`Successfully updated order status to ${status}`);
    res.status(200).json({
      message: `Order status updated to ${status}`,
      order: processedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    // Enhanced error logging
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Validation error details:", error.errors);
      return res.status(400).json({
        message: "Validation failed",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Internal server error while updating order status",
      error: error.message,
    });
  }
};
