const mongoose = require('mongoose');

// Each item in the order (one per product)
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: { type: String, required: true }, // snapshot at order time
  productImage: { type: String },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true }, // price at order time
  subtotal: { type: Number, required: true },
  // FCFS allocation breakdown across farmers
  farmerAllocations: [
    {
      farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      farmerName: { type: String },
      quantity: { type: Number },
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'Card'],
      required: true,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['COMPLETED'],
      default: 'COMPLETED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
