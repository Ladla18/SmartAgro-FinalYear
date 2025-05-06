import axiosInstance from "../config/axios";

export const marketplaceService = {
  // List a crop in the marketplace
  listCropInMarketplace: async (cropData) => {
    try {
      const response = await axiosInstance.post("/marketplace/list", cropData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to list crop in marketplace";
      throw errorMessage;
    }
  },

  // Remove a crop from the marketplace
  removeCropFromMarketplace: async (cropId) => {
    try {
      const response = await axiosInstance.delete(
        `/marketplace/remove/${cropId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to remove crop from marketplace";
      throw errorMessage;
    }
  },

  // Get all active marketplace listings
  getActiveListings: async () => {
    try {
      const response = await axiosInstance.get("/marketplace/active");
      return response.data.listings;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch marketplace listings";
      throw errorMessage;
    }
  },

  // Get my marketplace listings
  getMyListings: async () => {
    try {
      const response = await axiosInstance.get("/marketplace/my-listings");
      return response.data.listings;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch your marketplace listings";
      throw errorMessage;
    }
  },
};
