const { Message, Conversation } = require("../models/chat.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Get all conversations for the current user
module.exports.getConversations = async (req, res) => {
  try {
    // Find conversations where current user is a participant
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate({
        path: "participants",
        select: "fullName email userType profilePicture",
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt isRead quotation",
      })
      .sort({ updatedAt: -1 });

    // Filter out the current user from each conversation's participants
    const conversationsWithOtherParticipant = conversations.map((conv) => {
      const otherParticipants = conv.participants.filter(
        (p) => p._id.toString() !== req.user.userId
      );
      return {
        ...conv._doc,
        participants: otherParticipants,
        unreadCount: conv.unreadCount.get(req.user.userId) || 0,
      };
    });

    res.status(200).json({
      conversations: conversationsWithOtherParticipant,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get chat history with a specific user
module.exports.getChatHistory = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      // No history yet, return empty array
      return res.status(200).json({
        messages: [],
      });
    }

    // Get messages from the conversation
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: conversation._id,
        recipientId: userId,
        isRead: false,
      },
      { isRead: true }
    );

    // Update unread count
    if (conversation.unreadCount.get(userId) > 0) {
      conversation.unreadCount.set(userId, 0);
      await conversation.save();
    }

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message to another user
module.exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, quotation } = req.body;
    const senderId = req.user.userId;

    if (!recipientId || !content) {
      return res.status(400).json({
        message: "Recipient ID and message content are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        unreadCount: new Map([[recipientId, 1]]),
      });
    } else {
      // Increment unread count for the recipient
      const currentCount = conversation.unreadCount.get(recipientId) || 0;
      conversation.unreadCount.set(recipientId, currentCount + 1);
    }

    // Create new message
    const message = new Message({
      conversationId: conversation._id,
      senderId,
      recipientId,
      content,
      quotation,
    });

    await message.save();

    // Update conversation with lastMessage
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Get sender information to include in response
    const sender = await User.findById(senderId).select("fullName userType");

    // Prepare message data with sender details
    const messageWithSender = {
      ...message.toObject(),
      sender: sender,
    };

    // If we're using socket.io from the request, emit event
    if (req.io) {
      req.io.to(recipientId).emit("receive_message", messageWithSender);
      req.io.to(recipientId).emit("conversation_updated", {
        conversationId: conversation._id,
        lastMessage: message,
        unreadCount: conversation.unreadCount.get(recipientId) || 0,
      });
    }

    res.status(201).json({
      message: messageWithSender,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark messages as read
module.exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    // Update messages to read
    await Message.updateMany(
      {
        conversationId,
        recipientId: userId,
        isRead: false,
      },
      { isRead: true }
    );

    // Update unread count in conversation
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.unreadCount.set(userId, 0);
      await conversation.save();

      // Get the other user's ID
      const otherUserId = conversation.participants.find(
        (id) => id.toString() !== userId
      );

      // If using socket.io, emit that messages have been read
      if (req.io && otherUserId) {
        req.io.to(otherUserId.toString()).emit("messages_read", {
          conversationId,
          readBy: userId,
        });
      }
    }

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a quotation request
module.exports.sendQuotation = async (req, res) => {
  try {
    const {
      recipientId,
      cropName,
      quantity,
      unit,
      pricePerUnit,
      total,
      notes,
    } = req.body;
    const senderId = req.user.userId;

    if (!recipientId || !cropName || !quantity || !unit) {
      return res.status(400).json({
        message: "Recipient ID, crop name, quantity, and unit are required",
      });
    }

    const quotation = {
      cropName,
      quantity,
      unit,
      pricePerUnit,
      total,
      notes,
    };

    // Use the sendMessage function to send a message with quotation
    const content = notes || `Quotation request for ${cropName}`;

    // Create a custom req object with io
    const customReq = {
      body: { recipientId, content, quotation },
      user: { userId: senderId },
      io: req.io,
    };

    const messageData = await module.exports.sendMessage(customReq, {
      status: () => ({ json: (data) => data }),
    });

    res.status(201).json({
      quotation: messageData.message,
    });
  } catch (error) {
    console.error("Send quotation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
