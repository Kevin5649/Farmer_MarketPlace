const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const FarmerStock = require('../models/FarmerStock');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/FarmerMarketplace';

const categories = [
  { name: 'Vegetables', description: 'Fresh farm vegetables' },
  { name: 'Fruits', description: 'Fresh seasonal fruits' },
  { name: 'Grains', description: 'Whole grains and cereals' },
  { name: 'Pulses', description: 'Protein-rich pulses and legumes' },
];

const productData = [
  // Vegetables
  { name: 'Tomato', category: 'Vegetables', price: 40, image: '/images/tomato.jpg', description: 'Fresh red tomatoes, perfect for cooking and salads' },
  { name: 'Potato', category: 'Vegetables', price: 25, image: '/images/potato.svg', description: 'Farm-fresh potatoes, great for all purposes' },
  { name: 'Carrot', category: 'Vegetables', price: 35, image: '/images/carrot.jpg', description: 'Crisp orange carrots, rich in vitamins' },
  { name: 'Onion', category: 'Vegetables', price: 30, image: '/images/onion.jpg', description: 'Fresh onions, essential for every kitchen' },
  { name: 'Spinach', category: 'Vegetables', price: 20, image: '/images/spinach.svg', description: 'Tender leafy spinach, full of iron' },
  // Fruits
  { name: 'Apple', category: 'Fruits', price: 120, image: '/images/apple.svg', description: 'Crisp Himalayan apples, sweet and refreshing' },
  { name: 'Mango', category: 'Fruits', price: 80, image: '/images/mango.svg', description: 'Sweet Alphonso mangoes, king of fruits' },
  { name: 'Banana', category: 'Fruits', price: 30, image: '/images/banana.svg', description: 'Ripe yellow bananas, energy-packed' },
  // Grains
  { name: 'Rice', category: 'Grains', price: 55, image: '/images/rice.svg', description: 'Premium basmati rice, long grain and aromatic' },
  { name: 'Wheat', category: 'Grains', price: 32, image: '/images/wheat.svg', description: 'Whole wheat grain for fresh flour' },
  { name: 'Corn', category: 'Grains', price: 22, image: '/images/corn.svg', description: 'Fresh corn cobs, sweet and crunchy' },
  // Pulses
  { name: 'Chickpeas', category: 'Pulses', price: 90, image: '/images/chickpeas.svg', description: 'Protein-rich chickpeas, great for curries' },
  { name: 'Dal', category: 'Pulses', price: 70, image: '/images/dal.svg', description: 'Mixed lentil dal, staple of Indian cuisine' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      FarmerStock.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCategories = {};
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories[cat.name] = created._id;
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    const createdProducts = {};
    for (const prod of productData) {
      const created = await Product.create({
        ...prod,
        category: createdCategories[prod.category],
      });
      createdProducts[prod.name] = created._id;
    }
    console.log(`✅ Created ${productData.length} products`);

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@farmermarket.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`✅ Created admin: admin@farmermarket.com / admin123`);

    // Create sample farmers
    const farmer1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh@farmer.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '9876543210',
      address: { street: '12 Farm Lane', city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
    });

    const farmer2 = await User.create({
      name: 'Suresh Patel',
      email: 'suresh@farmer.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '9876543211',
      address: { street: '45 Green Fields', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    });

    const farmer3 = await User.create({
      name: 'Anita Singh',
      email: 'anita@farmer.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '9876543212',
      address: { street: '7 Harvest Road', city: 'Nagpur', state: 'Maharashtra', pincode: '440001' },
    });
    console.log('✅ Created 3 sample farmers');

    // Create sample customer
    await User.create({
      name: 'Priya Sharma',
      email: 'priya@customer.com',
      password: 'customer123',
      role: 'customer',
      phone: '9999999999',
      address: { street: '10 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });
    console.log('✅ Created sample customer: priya@customer.com / customer123');

    // Create farmer stock
    const stockData = [
      // Farmer 1 (Ramesh)
      { farmer: farmer1._id, product: createdProducts['Tomato'], quantity: 100 },
      { farmer: farmer1._id, product: createdProducts['Potato'], quantity: 150 },
      { farmer: farmer1._id, product: createdProducts['Onion'], quantity: 80 },
      { farmer: farmer1._id, product: createdProducts['Rice'], quantity: 200 },
      // Farmer 2 (Suresh)
      { farmer: farmer2._id, product: createdProducts['Tomato'], quantity: 75 },
      { farmer: farmer2._id, product: createdProducts['Carrot'], quantity: 60 },
      { farmer: farmer2._id, product: createdProducts['Apple'], quantity: 50 },
      { farmer: farmer2._id, product: createdProducts['Wheat'], quantity: 300 },
      { farmer: farmer2._id, product: createdProducts['Chickpeas'], quantity: 40 },
      // Farmer 3 (Anita)
      { farmer: farmer3._id, product: createdProducts['Mango'], quantity: 90 },
      { farmer: farmer3._id, product: createdProducts['Banana'], quantity: 120 },
      { farmer: farmer3._id, product: createdProducts['Spinach'], quantity: 30 },
      { farmer: farmer3._id, product: createdProducts['Dal'], quantity: 85 },
      { farmer: farmer3._id, product: createdProducts['Corn'], quantity: 70 },
    ];

    await FarmerStock.insertMany(stockData);
    console.log(`✅ Created ${stockData.length} farmer stock records`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:    admin@farmermarket.com   / admin123');
    console.log('🌾 Farmer 1: ramesh@farmer.com        / farmer123');
    console.log('🌾 Farmer 2: suresh@farmer.com        / farmer123');
    console.log('🌾 Farmer 3: anita@farmer.com         / farmer123');
    console.log('🛒 Customer: priya@customer.com       / customer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
