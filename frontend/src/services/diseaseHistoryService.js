import axiosInstance from "../config/axios";

export const diseaseHistoryService = {
  // Save a disease detection result to history
  saveToHistory: async (result, imageFile = null) => {
    try {
      // Extract the data we want to save
      const { mainPrediction, secondaryPredictions } = result;

      // Create form data to handle the file upload
      const formData = new FormData();

      // Add the result data as a JSON string in a field
      formData.append("cropName", mainPrediction.cropName);
      formData.append("disease", mainPrediction.disease);
      formData.append("probability", mainPrediction.probability);
      formData.append("description", mainPrediction.description);

      // Add treatments as separate entries
      mainPrediction.treatments.forEach((treatment, index) => {
        formData.append(`treatments[${index}]`, treatment);
      });

      // Add secondary predictions
      formData.append(
        "secondaryPredictions",
        JSON.stringify(secondaryPredictions)
      );

      // Add gemini analysis if any
      if (result.geminiAnalysis) {
        formData.append("geminiAnalysis", result.geminiAnalysis);
      }

      // Add the image file if provided
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Make the API request
      const response = await axiosInstance.post(
        "/disease-history/save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error saving disease history:", error);
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to save history"
      );
    }
  },

  // Get user's disease history
  getUserHistory: async () => {
    try {
      const response = await axiosInstance.get("/disease-history");
      return response.data.history;
    } catch (error) {
      console.error("Error fetching disease history:", error);
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch history"
      );
    }
  },

  // Get a specific history entry
  getHistoryById: async (historyId) => {
    try {
      const response = await axiosInstance.get(`/disease-history/${historyId}`);
      return response.data.historyEntry;
    } catch (error) {
      console.error("Error fetching history entry:", error);
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch history entry"
      );
    }
  },

  // Delete a history entry
  deleteHistory: async (historyId) => {
    try {
      await axiosInstance.delete(`/disease-history/${historyId}`);
      return true;
    } catch (error) {
      console.error("Error deleting history entry:", error);
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to delete history entry"
      );
    }
  },
};
