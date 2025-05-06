import { io } from "socket.io-client";
import { userService } from "./userService";

let socket;

export const socketService = {
  // Initialize socket connection
  init: () => {
    if (socket) return socket;

    // Connect to the server
    socket = io(`${import.meta.env.VITE_API_URL}/`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Handle connection events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      // Get current user and join personal room
      const user = userService.getCurrentUser();
      if (user && user.userId) {
        socketService.joinRoom(user.userId);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return socket;
  },

  // Get the socket instance
  getSocket: () => {
    if (!socket) {
      return socketService.init();
    }
    return socket;
  },

  // Join a user's room for private messaging
  joinRoom: (userId) => {
    if (!socket || !userId) return;

    console.log("Joining room:", userId);
    socket.emit("join_room", userId);
  },

  // Subscribe to message events
  onReceiveMessage: (callback) => {
    if (!socket) return;

    socket.on("receive_message", (message) => {
      if (callback) callback(message);
    });
  },

  // Subscribe to conversation update events
  onConversationUpdated: (callback) => {
    if (!socket) return;

    socket.on("conversation_updated", (data) => {
      if (callback) callback(data);
    });
  },

  // Subscribe to messages read events
  onMessagesRead: (callback) => {
    if (!socket) return;

    socket.on("messages_read", (data) => {
      if (callback) callback(data);
    });
  },

  // Clean up subscriptions
  removeAllListeners: () => {
    if (!socket) return;

    socket.off("receive_message");
    socket.off("conversation_updated");
    socket.off("messages_read");
  },

  // Disconnect socket
  disconnect: () => {
    if (!socket) return;

    socket.disconnect();
    socket = null;
  },
};
