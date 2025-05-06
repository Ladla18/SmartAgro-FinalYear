import axiosInstance from "../config/axios";

export const cropService = {
  // Add a new crop
  addCrop: async (formData) => {
    try {
      const response = await axiosInstance.post("/crops/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add crop";
      throw errorMessage;
    }
  },

  // Get all crops for the current user
  getUserCrops: async () => {
    try {
      const response = await axiosInstance.get("/crops/user-crops");
      return response.data.crops;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch crops";
      throw errorMessage;
    }
  },

  // Get all available crops (for buyers)
  getAvailableCrops: async () => {
    try {
      const response = await axiosInstance.get("/crops/available");
      return response.data.crops;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch available crops";
      throw errorMessage;
    }
  },

  // Get marketplace listings
  getMarketplaceListings: async () => {
    try {
      const response = await axiosInstance.get("/marketplace/active");
      console.log("Marketplace listings:", response.data.listings);
      return response.data.listings;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch marketplace listings";
      throw errorMessage;
    }
  },

  // Get farmer's marketplace listings
  getMyMarketplaceListings: async () => {
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

  // Update crop details
  updateCrop: async (cropId, cropData) => {
    try {
      const response = await axiosInstance.put(
        `/crops/update/${cropId}`,
        cropData
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update crop";
      throw errorMessage;
    }
  },

  // Update crop status
  updateCropStatus: async (cropId, status) => {
    try {
      const response = await axiosInstance.patch("/crops/update-status", {
        cropId,
        status,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update crop status";
      throw errorMessage;
    }
  },

  // Delete crop
  deleteCrop: async (cropId) => {
    try {
      const response = await axiosInstance.delete(`/crops/delete/${cropId}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete crop";
      throw errorMessage;
    }
  },
};
