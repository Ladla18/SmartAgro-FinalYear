import axiosInstance from "../config/axios";

export const orderService = {
  // Get the current user's order basket
  getOrderBasket: async () => {
    try {
      const response = await axiosInstance.get("/orders/basket");
      return response.data.orderBasket;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch order basket";
      throw errorMessage;
    }
  },

  // Add an item to the order basket
  addToBasket: async (listingId, quantity) => {
    try {
      const response = await axiosInstance.post("/orders/basket/add", {
        listingId,
        quantity,
      });
      return response.data.orderBasket;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add item to basket";
      throw errorMessage;
    }
  },

  // Remove an item from the order basket
  removeFromBasket: async (itemId) => {
    try {
      const response = await axiosInstance.delete(
        `/orders/basket/item/${itemId}`
      );
      return response.data.orderBasket;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove item from basket";
      throw errorMessage;
    }
  },

  // Update item quantity in the basket
  updateItemQuantity: async (itemId, quantity) => {
    try {
      const response = await axiosInstance.patch(
        `/orders/basket/item/${itemId}`,
        {
          quantity,
        }
      );
      return response.data.orderBasket;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update item quantity";
      throw errorMessage;
    }
  },

  // Clear the order basket
  clearBasket: async () => {
    try {
      const response = await axiosInstance.delete("/orders/basket/clear");
      return response.data.orderBasket;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to clear basket";
      throw errorMessage;
    }
  },

  // Proceed to checkout
  checkout: async (checkoutData) => {
    try {
      const response = await axiosInstance.post(
        "/orders/checkout",
        checkoutData
      );
      return response.data.orderBasket;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to proceed to checkout";
      throw errorMessage;
    }
  },

  // Get order history for current user
  getOrderHistory: async () => {
    try {
      const response = await axiosInstance.get("/orders/history");
      return response.data.orders;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch order history";
      throw errorMessage;
    }
  },

  // Get order details by ID
  getOrderDetails: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch order details";
      throw errorMessage;
    }
  },

  // Get orders received by farmer
  getReceivedOrders: async () => {
    try {
      const response = await axiosInstance.get("/orders/received");
      return response.data.orders;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch received orders";
      throw errorMessage;
    }
  },

  // Update order status (for farmers)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
        status,
      });
      return response.data.order;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update order status";
      throw errorMessage;
    }
  },
};
