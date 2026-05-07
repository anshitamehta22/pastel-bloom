// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET / → Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
});

// POST / → Create a new order
router.post('/', async (req, res) => {
  try {
    // ADDED: Explicit validation for required fields before saving
    const { name, phone, address } = req.body;
    if (!name || !phone || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, phone, and address are required' 
      });
    }

    // ADDED: Debug log for incoming request payload
    console.log('📥 Incoming Order Request:', req.body);

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    // IMPROVED: Consistent response format with success message
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: savedOrder
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
});

module.exports = router;
