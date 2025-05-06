import React, { useState, useEffect } from "react";
import { chatService } from "../services/chatService";
import { userService } from "../services/userService";
import { socketService } from "../services/socketService";
import { toast } from "react-hot-toast";
import { MessageSquare, User, Clock, Circle, X } from "lucide-react";
import ChatModal from "./ChatModal";

const Inbox = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      const user = userService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }

      // Set up WebSocket listeners
      const socket = socketService.getSocket();

      // Listen for new messages to update conversation list
      socketService.onConversationUpdated(handleConversationUpdated);

      // Listen for messages being marked as read
      socketService.onMessagesRead(handleMessagesRead);
    }

    return () => {
      // Clean up listeners when component unmounts
      socketService.removeAllListeners();
    };
  }, [isOpen]);

  const handleConversationUpdated = (data) => {
    console.log("Conversation updated:", data);

    // Update the conversation list with new message data
    setConversations((prev) => {
      // Check if conversation exists in the list
      const conversationIndex = prev.findIndex(
        (conv) => conv._id === data.conversationId
      );

      if (conversationIndex >= 0) {
        // Update existing conversation
        const updatedConversations = [...prev];
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          lastMessage: data.lastMessage,
          unreadCount: data.unreadCount,
        };

        // Move this conversation to the top
        const movedConversation = updatedConversations.splice(
          conversationIndex,
          1
        )[0];
        return [movedConversation, ...updatedConversations];
      } else {
        // This is a new conversation - fetch all conversations
        fetchConversations();
        return prev;
      }
    });
  };

  const handleMessagesRead = (data) => {
    console.log("Messages marked as read:", data);

    // Update unread count for the specific conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === data.conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await chatService.getConversations();
      console.log("Conversations fetched:", response);
      setConversations(response || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (conversation) => {
    if (
      !conversation ||
      !conversation.participants ||
      !conversation.participants[0]
    ) {
      toast.error("Invalid conversation data");
      return;
    }

    // Set the recipient from the participants array
    const recipient = conversation.participants[0];
    setSelectedConversation({
      recipient,
      conversationId: conversation._id,
    });
    setChatModalOpen(true);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const today = new Date();

    // If the message is from today, show the time
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If the message is from this week, show the day name
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    // Otherwise show the date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col h-[600px] max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-green-50">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-green-800">Inbox</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-gray-500 text-sm mt-1">
                When buyers contact you, their messages will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => {
                const recipient = conversation.participants[0];
                const lastMessage = conversation.lastMessage;
                const hasUnread = conversation.unreadCount > 0;

                return (
                  <div
                    key={conversation._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center ${
                      hasUnread ? "bg-green-50" : ""
                    }`}
                    onClick={() => handleOpenChat(conversation)}
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {recipient?.fullName || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(lastMessage?.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">
                          {lastMessage?.content || "No messages yet"}
                        </p>
                        {hasUnread && (
                          <Circle className="h-2 w-2 text-green-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {chatModalOpen && selectedConversation && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedConversation(null);
            fetchConversations(); // Refresh conversations after closing chat
          }}
          recipient={selectedConversation.recipient}
          conversationId={selectedConversation.conversationId}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Inbox;
