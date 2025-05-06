const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Quotation schema for price negotiation
const QuotationSchema = new Schema({
  cropName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    min: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

// Message schema
const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    quotation: QuotationSchema,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Conversation schema to track conversations between users
const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Map, // Map of userId -> unread count
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = {
  Message,
  Conversation,
};
