const mongoose = require('mongoose');

const farmerStockSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
  },
  { timestamps: true }
);

// Ensure one record per farmer per product
farmerStockSchema.index({ farmer: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('FarmerStock', farmerStockSchema);
