const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const FarmerStock = require('../models/FarmerStock');

// @desc  Get admin dashboard stats
// @route GET /api/admin/stats
// @access Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalCustomers, totalFarmers, totalProducts, totalOrders, recentOrders] =
      await Promise.all([
        User.countDocuments({ role: 'customer', isActive: true }),
        User.countDocuments({ role: 'farmer', isActive: true }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name email'),
      ]);

    // Total revenue
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      totalCustomers,
      totalFarmers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all customers
// @route GET /api/admin/customers
// @access Admin
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete customer
// @route DELETE /api/admin/customers/:id
// @access Admin
const deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all farmers
// @route GET /api/admin/farmers
// @access Admin
const getFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete farmer
// @route DELETE /api/admin/farmers/:id
// @access Admin
const deleteFarmer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    // Remove their stock records too
    await FarmerStock.deleteMany({ farmer: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Farmer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getCustomers,
  deleteCustomer,
  getFarmers,
  deleteFarmer,
};
