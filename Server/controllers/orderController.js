const Order = require('../models/Order');
const Product = require('../models/Product');
const FarmerStock = require('../models/FarmerStock');
const User = require('../models/User');

// Helper: FCFS allocation across farmers for a single product
// Returns array of { farmerStock, allocated } or null if insufficient stock
const fcfsAllocate = (farmerStocks, required) => {
  const allocations = [];
  let remaining = required;

  for (const stockRecord of farmerStocks) {
    if (remaining <= 0) break;

    const take = Math.min(stockRecord.quantity, remaining);

    if (take > 0) {
      allocations.push({ stockRecord, take });
      remaining -= take;
    }
  }

  if (remaining > 0) return null;

  return allocations;
};

// @desc  Place an order
// @route POST /api/orders
// @access Customer
const placeOrder = async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress } = req.body;

    // Basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    if (!['COD', 'UPI', 'Card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        message: 'Complete delivery address is required',
      });
    }

    // Validate quantity increments (must be multiple of 0.5, min 0.5)
    for (const item of items) {
      if (item.quantity < 0.5 || item.quantity % 0.5 !== 0) {
        return res.status(400).json({
          message: 'Quantity must be at least 0.5 kg and in 0.5 kg increments',
        });
      }
    }

    // Process each item: validate product, check stock, allocate FCFS
    const orderItems = [];
    const stockUpdates = [];

    for (const item of items) {
      const prodId = item.productId || item.product;

      const product = await Product.findById(prodId);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Product not found: ${prodId}`,
        });
      }

      // Get farmer stocks sorted by createdAt (FCFS - earliest farmer first)
      const farmerStocks = await FarmerStock.find({
        product: product._id,
        quantity: { $gt: 0 },
      })
        .populate('farmer', 'name')
        .sort({ createdAt: 1 });

      const allocations = fcfsAllocate(farmerStocks, item.quantity);

      if (!allocations) {
        const totalAvailable = farmerStocks.reduce(
          (sum, s) => sum + s.quantity,
          0
        );

        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${totalAvailable} kg, Requested: ${item.quantity} kg`,
        });
      }

      const subtotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity,
        pricePerKg: product.price,
        subtotal,
        farmerAllocations: allocations.map((a) => ({
          farmer: a.stockRecord.farmer._id,
          farmerName: a.stockRecord.farmer.name,
          quantity: a.take,
        })),
      });

      // Track stock deductions
      allocations.forEach((a) => {
        stockUpdates.push({
          stockId: a.stockRecord._id,
          deduct: a.take,
        });
      });
    }

    // All validations passed - now apply stock deductions
    for (const update of stockUpdates) {
      await FarmerStock.findByIdAndUpdate(update.stockId, {
        $inc: { quantity: -update.deduct },
      });
    }

    // Calculate total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    // Create the order
    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      status: 'COMPLETED',
    });

    const populated = await Order.findById(order._id).populate(
      'customer',
      'name email'
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get current customer's orders
// @route GET /api/orders/my
// @access Customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get farmer's related orders
// @route GET /api/orders/farmer
// @access Farmer
const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.farmerAllocations.farmer': req.user._id,
    })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    const farmerOrders = orders.map((order) => {
      const relevantItems = [];

      order.items.forEach((item) => {
        const farmerAllocations = item.farmerAllocations.filter(
          (allocation) =>
            allocation.farmer &&
            allocation.farmer.toString() === req.user._id.toString()
        );

        if (farmerAllocations.length > 0) {
          const farmerQuantity = farmerAllocations.reduce(
            (sum, allocation) => sum + allocation.quantity,
            0
          );

          const farmerAmount = farmerQuantity * item.pricePerKg;

          relevantItems.push({
            product: item.product,
            productName: item.productName,
            productImage: item.productImage,
            pricePerKg: item.pricePerKg,
            quantity: farmerQuantity,
            amount: farmerAmount,
          });
        }
      });

      const farmerAmount = relevantItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      return {
        _id: order._id,
        customer: order.customer,
        items: relevantItems,
        totalAmount: order.totalAmount,
        farmerAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
      };
    });

    res.json(farmerOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get farmer's specific order details
// @route GET /api/orders/farmer/:id
// @access Farmer
const getFarmerOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'customer',
      'name email'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const relevantItems = [];

    order.items.forEach((item) => {
      const farmerAllocations = item.farmerAllocations.filter(
        (allocation) =>
          allocation.farmer &&
          allocation.farmer.toString() === req.user._id.toString()
      );

      if (farmerAllocations.length > 0) {
        const farmerQuantity = farmerAllocations.reduce(
          (sum, allocation) => sum + allocation.quantity,
          0
        );

        const farmerAmount = farmerQuantity * item.pricePerKg;

        relevantItems.push({
          product: item.product,
          productName: item.productName,
          productImage: item.productImage,
          pricePerKg: item.pricePerKg,
          quantity: farmerQuantity,
          amount: farmerAmount,
        });
      }
    });

    // Farmer cannot view orders where they supplied nothing
    if (relevantItems.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const farmerAmount = relevantItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      _id: order._id,
      customer: order.customer,
      items: relevantItems,
      totalAmount: order.totalAmount,
      farmerAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get order by ID
// @route GET /api/orders/:id
// @access Customer / Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'customer',
      'name email'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Customer can only see their own orders; admin can see all
    if (
      req.user.role === 'customer' &&
      order.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all orders (Admin)
// @route GET /api/orders
// @access Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  getFarmerOrderById,
  getOrderById,
  getAllOrders,
};