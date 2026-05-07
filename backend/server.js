// server.js - Pastel Bloom Backend (FINAL CLEAN VERSION)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// ✅ MongoDB LOCAL CONNECTION (FINAL WORKING)
mongoose.connect("mongodb://127.0.0.1:27017/pastelBloom")
  .then(() => console.log("✅ MongoDB connected locally"))
  .catch(err => console.error("❌ MongoDB error:", err));


// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌸 Pastel Bloom API is running'
  });
});


// Routes
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
