const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCustomers,
  deleteCustomer,
  getFarmers,
  deleteFarmer,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { getAllOrders, getOrderById } = require('../controllers/orderController');

router.use(protect, authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/customers', getCustomers);
router.delete('/customers/:id', deleteCustomer);
router.get('/farmers', getFarmers);
router.delete('/farmers/:id', deleteFarmer);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);

module.exports = router;

