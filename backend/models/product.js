'use strict';
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, default: '' },
  category: { type: String, required: true },
  purchaseDate: { type: String, required: true },
  warrantyMonths: { type: Number, required: true },
  expiryDate: { type: String },
  price: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  retailer: { type: String, default: '' },
  serialNumber: { type: String, default: '' },
  invoiceNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { type: String, default: 'active' },
  userId: { type: String, default: 'guest' },
  createdAt: { type: String },
  updatedAt: { type: String },
});

module.exports = mongoose.model('Product', productSchema);
