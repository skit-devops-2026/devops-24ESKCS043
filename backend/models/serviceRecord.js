'use strict';
const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  center: { type: String, required: true },
  issue: { type: String, required: true },
  cost: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  notes: { type: String, default: '' },
  createdAt: { type: String },
  updatedAt: { type: String },
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
