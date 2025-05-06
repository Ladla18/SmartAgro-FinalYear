import { userService } from "./userService";

// Base URL for API - use environment variable if available
const API_URL =
  import.meta.env.VITE_API_URL || "https://smart-agriculture-app.onrender.com";

// Helper to get authentication header
const getAuthHeader = () => {
  // Get token directly from localStorage instead of user object
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all sourced products for the current buyer
const getSourcedProducts = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/sourced-products`,
      getAuthHeader()
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch sourced products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching sourced products:", error);
    throw error.message || "Failed to fetch sourced products";
  }
};

// Source a new product
const sourceProduct = async (listingId) => {
  try {
    const response = await fetch(`${API_URL}/api/sourced-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader().headers,
      },
      body: JSON.stringify({ listingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to source product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sourcing product:", error);
    throw error.message || "Failed to source product";
  }
};

// Remove a product from sourced list
const removeSourcedProduct = async (sourcedProductId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/sourced-products/${sourcedProductId}`,
      {
        method: "DELETE",
        ...getAuthHeader(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove sourced product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing sourced product:", error);
    throw error.message || "Failed to remove sourced product";
  }
};

// Update a sourced product (e.g., add notes or change status)
const updateSourcedProduct = async (sourcedProductId, updates) => {
  try {
    const response = await fetch(
      `${API_URL}/api/sourced-products/${sourcedProductId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader().headers,
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update sourced product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating sourced product:", error);
    throw error.message || "Failed to update sourced product";
  }
};

// Test auth function - helpful for debugging
const testAuth = async () => {
  try {
    console.log("Testing auth with token:", localStorage.getItem("token"));
    const response = await fetch(
      `${API_URL}/api/sourced-products/test`,
      getAuthHeader()
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Auth test failed");
    }

    const data = await response.json();
    console.log("Auth test result:", data);
    return data;
  } catch (error) {
    console.error("Auth test error:", error);
    throw error.message || "Auth test failed";
  }
};

export const sourcedProductService = {
  getSourcedProducts,
  sourceProduct,
  removeSourcedProduct,
  updateSourcedProduct,
  testAuth,
};
