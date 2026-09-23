const FarmerStock = require('../models/FarmerStock');
const Product = require('../models/Product');

// @desc  Get farmer's own stock
// @route GET /api/farmer/stock
// @access Farmer
const getMyStock = async (req, res) => {
  try {
    const stock = await FarmerStock.find({ farmer: req.user._id })
      .populate({
        path: 'product',
        populate: { path: 'category', select: 'name' },
      })
      .sort({ updatedAt: -1 });

    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add or update stock
// @route POST /api/farmer/stock
// @access Farmer
const addOrUpdateStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product and quantity are required' });
    }
    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    // Upsert: if record exists, add to quantity; if not, create it
    const existingStock = await FarmerStock.findOne({
      farmer: req.user._id,
      product: productId,
    });

    let stock;
    if (existingStock) {
      existingStock.quantity += Number(quantity);
      stock = await existingStock.save();
    } else {
      stock = await FarmerStock.create({
        farmer: req.user._id,
        product: productId,
        quantity: Number(quantity),
      });
    }

    const populated = await FarmerStock.findById(stock._id).populate({
      path: 'product',
      populate: { path: 'category', select: 'name' },
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Set exact stock quantity (edit/correct)
// @route PUT /api/farmer/stock/:id
// @access Farmer
const setStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Valid quantity required' });
    }

    const stock = await FarmerStock.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }

    stock.quantity = Number(quantity);
    await stock.save();

    const populated = await FarmerStock.findById(stock._id).populate({
      path: 'product',
      populate: { path: 'category', select: 'name' },
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove farmer's stock record (stop selling product)
// @route DELETE /api/farmer/stock/:id
// @access Farmer
const removeStock = async (req, res) => {
  try {
    const stock = await FarmerStock.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }

    await FarmerStock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stock removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyStock, addOrUpdateStock, setStock, removeStock };
