const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  getFarmerOrderById,
  getOrderById,
  getAllOrders,
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.post('/', protect, authorize('customer'), placeOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);

// Farmer routes
router.get('/farmer', protect, authorize('farmer'), getFarmerOrders);
router.get('/farmer/:id', protect, authorize('farmer'), getFarmerOrderById);

// Admin route
router.get('/', protect, authorize('admin'), getAllOrders);

// Shared (customer sees own, admin sees all - handled in controller)
router.get('/:id', protect, authorize('customer', 'admin'), getOrderById);

module.exports = router;