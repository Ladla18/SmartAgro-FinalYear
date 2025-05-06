const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for individual order items
const orderItemSchema = new Schema({
  cropId: {
    type: Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },
  listingId: {
    type: Schema.Types.ObjectId,
    ref: "Marketplace",
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

// Order basket schema
const orderBasketSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "checkout", "processing", "shipped", "completed", "cancelled"],
    default: "active",
  },
  total: {
    type: Number,
    default: 0,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "bank_transfer", "cash_on_delivery", ""],
    default: "",
  },
  notes: {
    type: String,
  },
});

// Method to recalculate the total
orderBasketSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce((total, item) => total + item.subtotal, 0);
  return this.total;
};

const OrderBasket = mongoose.model("OrderBasket", orderBasketSchema);

module.exports = OrderBasket;
