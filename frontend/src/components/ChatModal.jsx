import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  PaperclipIcon,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import { chatService } from "../services/chatService";
import { socketService } from "../services/socketService";
import { toast } from "react-hot-toast";

const ChatModal = ({
  isOpen,
  onClose,
  recipient,
  listing,
  currentUser,
  conversationId,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotation, setQuotation] = useState({
    cropName: listing?.cropId?.cropName || "",
    quantity: listing?.minOrderQuantity || 1,
    unit: listing?.cropId?.unit || "kg",
    pricePerUnit: "",
    total: 0,
    notes: "",
  });

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (isOpen && recipient?._id) {
      console.log("Fetching chat history with recipient:", recipient._id);
      fetchChatHistory();

      // If conversationId is provided, mark messages as read
      if (conversationId) {
        markMessagesAsRead(conversationId);
      }

      // Initialize socket connection
      socket.current = socketService.getSocket();

      // Listen for incoming messages
      socketService.onReceiveMessage(handleIncomingMessage);

      // Listen for read receipts
      socketService.onMessagesRead(handleMessagesRead);
    } else if (isOpen && recipient) {
      console.log("Recipient object:", recipient);
      toast.error("Cannot load chat: Invalid recipient ID");
    }

    // Cleanup listeners when component unmounts
    return () => {
      socketService.removeAllListeners();
    };
  }, [isOpen, recipient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Calculate total amount in quotation
    if (quotation.quantity && quotation.pricePerUnit) {
      setQuotation((prev) => ({
        ...prev,
        total: parseFloat(prev.quantity) * parseFloat(prev.pricePerUnit),
      }));
    }
  }, [quotation.quantity, quotation.pricePerUnit]);

  const handleIncomingMessage = (message) => {
    console.log("Received new message via socket:", message);

    // Only add the message if it's from the current chat's recipient
    if (message.senderId === recipient._id) {
      setMessages((prev) => [...prev, message]);

      // Mark the message as read immediately
      if (message.conversationId) {
        markMessagesAsRead(message.conversationId);
      }
    }
  };

  const handleMessagesRead = (data) => {
    console.log("Messages marked as read:", data);

    // Update the read status of messages if they match the current conversation
    if (data.conversationId === conversationId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === currentUser?.userId ? { ...msg, isRead: true } : msg
        )
      );
    }
  };

  const fetchChatHistory = async () => {
    if (!recipient || !recipient._id) {
      console.error("Invalid recipient:", recipient);
      return;
    }

    setLoading(true);
    try {
      console.log("Making API call to get chat history");
      const history = await chatService.getChatHistory(recipient._id);
      console.log("Chat history received:", history);
      setMessages(history || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (convId) => {
    if (!convId) return;

    try {
      await chatService.markAsRead(convId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate recipient and message
    if (!recipient || !recipient._id) {
      toast.error("Invalid recipient");
      return;
    }

    if (!newMessage.trim() && !showQuotationForm) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending message to recipient:", recipient._id);
      let sentMessage;

      if (showQuotationForm) {
        // Validate quotation data
        if (!quotation.cropName || !quotation.quantity) {
          throw new Error("Please fill in all quotation fields");
        }

        // Send message with quotation
        console.log("Sending quotation:", quotation);
        sentMessage = await chatService.sendMessage(
          recipient._id,
          quotation.notes || "Here's my quotation request",
          quotation
        );
        setShowQuotationForm(false);
      } else {
        // Send regular message
        console.log("Sending regular message:", newMessage);
        sentMessage = await chatService.sendMessage(recipient._id, newMessage);
      }

      console.log("Message sent successfully:", sentMessage);

      // Add the new message to the messages array
      if (sentMessage) {
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");

        // Reset quotation form
        setQuotation({
          cropName: listing?.cropId?.cropName || "",
          quantity: listing?.minOrderQuantity || 1,
          unit: listing?.cropId?.unit || "kg",
          pricePerUnit: "",
          total: 0,
          notes: "",
        });
      } else {
        throw new Error("No message data returned from server");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleQuotationChange = (e) => {
    const { name, value } = e.target;
    setQuotation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col h-[600px] max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-green-50">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">
                {recipient?.fullName || "User"}
              </h3>
              <p className="text-xs text-gray-500">
                {recipient?.userType === "farmer" ? "Farmer" : "Buyer"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser?.userId;

              return (
                <div
                  key={message._id || index}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? "bg-green-100 text-green-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {/* Quotation Preview if exists */}
                    {message.quotation && (
                      <div className="mb-2 p-2 bg-white rounded border border-gray-200 text-sm">
                        <div className="font-medium mb-1 flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          Quotation Request
                        </div>
                        <div className="space-y-1">
                          <div>Product: {message.quotation.cropName}</div>
                          <div>
                            Quantity: {message.quotation.quantity}{" "}
                            {message.quotation.unit}
                          </div>
                          {message.quotation.pricePerUnit && (
                            <>
                              <div>
                                Price: ₹{message.quotation.pricePerUnit}/
                                {message.quotation.unit}
                              </div>
                              <div>
                                Total: ₹{message.quotation.total.toFixed(2)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <p>{message.content}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quotation Form */}
        {showQuotationForm && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                New Quotation Request
              </h4>
              <button
                onClick={() => setShowQuotationForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Product
                </label>
                <input
                  type="text"
                  name="cropName"
                  value={quotation.cropName}
                  onChange={handleQuotationChange}
                  className="w-full p-2 text-sm border rounded"
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={quotation.quantity}
                    onChange={handleQuotationChange}
                    className="w-full p-2 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={quotation.unit}
                    disabled
                    className="w-full p-2 text-sm border rounded bg-gray-50"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Price per {quotation.unit}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="pricePerUnit"
                    min="0"
                    step="0.01"
                    value={quotation.pricePerUnit}
                    onChange={handleQuotationChange}
                    className="w-full p-2 pl-6 text-sm border rounded"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Total
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={quotation.total.toFixed(2)}
                    className="w-full p-2 pl-6 text-sm border rounded bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Notes</label>
              <textarea
                name="notes"
                value={quotation.notes}
                onChange={handleQuotationChange}
                className="w-full p-2 text-sm border rounded"
                rows="2"
                placeholder="Any additional details..."
              ></textarea>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            {!showQuotationForm && (
              <button
                type="button"
                onClick={() => setShowQuotationForm(true)}
                className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
                title="Send Quotation"
              >
                <DollarSign className="h-5 w-5" />
              </button>
            )}

            {!showQuotationForm && (
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            )}

            <button
              type="submit"
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={loading || (!newMessage.trim() && !showQuotationForm)}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
