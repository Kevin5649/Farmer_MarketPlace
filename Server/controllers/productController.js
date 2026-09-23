const Product = require('../models/Product');
const FarmerStock = require('../models/FarmerStock');

// @desc  Get all products (with combined stock for marketplace)
// @route GET /api/products
// @access Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = { isActive: true };
    if (category) filter.category = category;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ name: 1 });

    // Calculate combined stock from all farmer records
    const productIds = products.map((p) => p._id);
    const stockAggregation = await FarmerStock.aggregate([
      { $match: { product: { $in: productIds }, quantity: { $gt: 0 } } },
      { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } },
    ]);

    const stockMap = {};
    stockAggregation.forEach((s) => {
      stockMap[s._id.toString()] = s.totalQuantity;
    });

    const productsWithStock = products.map((p) => ({
      ...p.toObject(),
      availableQuantity: stockMap[p._id.toString()] || 0,
    }));

    res.json(productsWithStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Get combined stock
    const stockAgg = await FarmerStock.aggregate([
      { $match: { product: product._id, quantity: { $gt: 0 } } },
      { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } },
    ]);

    const availableQuantity = stockAgg.length > 0 ? stockAgg[0].totalQuantity : 0;

    res.json({ ...product.toObject(), availableQuantity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create product (Admin only)
// @route POST /api/products
// @access Admin
const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const product = await Product.create({
      name,
      category,
      description,
      price,
      image: image || `/images/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    });

    const populated = await product.populate('category', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update product (Admin only)
// @route PUT /api/products/:id
// @access Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete product (Admin only)
// @route DELETE /api/products/:id
// @access Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove all farmer stock records for this product
    await FarmerStock.deleteMany({ product: req.params.id });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
