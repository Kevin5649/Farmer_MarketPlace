const Cart = require('../models/Cart');
const Product = require('../models/Product');
const FarmerStock = require('../models/FarmerStock');

// Get current combined stock for a product
const getAvailableQuantity = async (productId) => {
  const stockAgg = await FarmerStock.aggregate([
    {
      $match: {
        product: productId,
        quantity: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: '$product',
        totalQuantity: { $sum: '$quantity' },
      },
    },
  ]);

  return stockAgg.length > 0 ? stockAgg[0].totalQuantity : 0;
};

// @desc  Get current customer's cart
// @route GET /api/cart
// @access Customer
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.json({ customer: req.user._id, items: [] });
    }

    // Refresh current product information and stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (product && product.isActive) {
        item.productName = product.name;
        item.price = product.price;
        item.image = product.image;
        item.availableQuantity = await getAvailableQuantity(product._id);
      }
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add product to cart
// @route POST /api/cart
// @access Customer
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 0.5 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (quantity < 0.5 || quantity % 0.5 !== 0) {
      return res.status(400).json({
        message: 'Quantity must be at least 0.5 kg and in 0.5 kg increments',
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const availableQuantity = await getAvailableQuantity(product._id);

    if (availableQuantity <= 0) {
      return res.status(400).json({
        message: `${product.name} is out of stock`,
      });
    }

    let cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      cart = new Cart({
        customer: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > availableQuantity) {
        return res.status(400).json({
          message: `Only ${availableQuantity} kg available`,
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.productName = product.name;
      existingItem.price = product.price;
      existingItem.image = product.image;
      existingItem.availableQuantity = availableQuantity;
    } else {
      if (quantity > availableQuantity) {
        return res.status(400).json({
          message: `Only ${availableQuantity} kg available`,
        });
      }

      cart.items.push({
        product: product._id,
        productName: product.name,
        price: product.price,
        image: product.image,
        availableQuantity,
        quantity,
      });
    }

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update cart item quantity
// @route PUT /api/cart/:productId
// @access Customer
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined || quantity < 0.5 || quantity % 0.5 !== 0) {
      return res.status(400).json({
        message: 'Quantity must be at least 0.5 kg and in 0.5 kg increments',
      });
    }

    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const availableQuantity = await getAvailableQuantity(product._id);

    if (availableQuantity <= 0) {
      return res.status(400).json({
        message: `${product.name} is out of stock`,
      });
    }

    if (quantity > availableQuantity) {
      return res.status(400).json({
        message: `Only ${availableQuantity} kg available`,
      });
    }

    item.quantity = quantity;
    item.productName = product.name;
    item.price = product.price;
    item.image = product.image;
    item.availableQuantity = availableQuantity;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove product from cart
// @route DELETE /api/cart/:productId
// @access Customer
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Clear current customer's cart
// @route DELETE /api/cart
// @access Customer
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.json({ customer: req.user._id, items: [] });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};