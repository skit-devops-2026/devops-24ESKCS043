'use strict';
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: String },
  updatedAt: { type: String },
});

module.exports = mongoose.model('Category', categorySchema);
