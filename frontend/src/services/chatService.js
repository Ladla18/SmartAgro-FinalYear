import axiosInstance from "../config/axios";

export const chatService = {
  // Get all conversations for the current user
  getConversations: async () => {
    try {
      const response = await axiosInstance.get("/chats/conversations");
      return response.data.conversations;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch conversations";
      throw errorMessage;
    }
  },

  // Get chat history with a specific user
  getChatHistory: async (recipientId) => {
    try {
      const response = await axiosInstance.get(`/chats/history/${recipientId}`);
      return response.data.messages;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch chat history";
      throw errorMessage;
    }
  },

  // Send a message to another user
  sendMessage: async (recipientId, messageContent, quotation = null) => {
    try {
      const response = await axiosInstance.post("/chats/send", {
        recipientId,
        content: messageContent,
        quotation,
      });
      return response.data.message;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send message";
      throw errorMessage;
    }
  },

  // Send a quotation request
  sendQuotation: async (recipientId, quotationData) => {
    try {
      const response = await axiosInstance.post("/chats/quotation", {
        recipientId,
        ...quotationData,
      });
      return response.data.quotation;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send quotation";
      throw errorMessage;
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId) => {
    try {
      const response = await axiosInstance.patch(
        `/chats/mark-read/${conversationId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark messages as read";
      throw errorMessage;
    }
  },
};
