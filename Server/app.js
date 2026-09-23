const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Register SVG MIME type
express.static.mime.define({ 'image/svg+xml': ['svg'] });

// CORS - allow frontend dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static product images from public/images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/farmer', require('./routes/farmerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Farmer Marketplace API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
