const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc  Get all categories
// @route GET /api/categories
// @access Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create category
// @route POST /api/categories
// @access Admin
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const existing = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update category
// @route PUT /api/categories/:id
// @access Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete category
// @route DELETE /api/categories/:id
// @access Admin
const deleteCategory = async (req, res) => {
  try {
    const products = await Product.countDocuments({ category: req.params.id });
    if (products > 0) {
      return res.status(400).json({ message: 'Cannot delete category that has products' });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
