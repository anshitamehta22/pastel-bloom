// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Delivery address is required'],
    trim: true
  },
  // IMPROVED: Replaced generic [{}] with a strict, reusable item structure
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  // ADDED: Optional subdocument for custom bouquet requests
  customBouquet: {
    flowers: { type: String, default: "" },
    colors: { type: String, default: "" },
    size: { type: String, enum: ["small", "medium", "large"], default: null },
    note: { type: String, default: "" },
    addOns: { type: [String], default: [] }
  },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'delivered'],
    default: 'placed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
