'use strict';
const express = require('express');
const router = express.Router();

const Product = require('../models/product');

// Helper to handle async errors
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// GET /api/products - list with optional filters
router.get('/', asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.userId) query.userId = req.query.userId;
  if (req.query.category) query.category = req.query.category;
  if (req.query.status) query.status = req.query.status;
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { model: { $regex: q, $options: 'i' } },
      { serialNumber: { $regex: q, $options: 'i' } },
    ];
  }
  const products = await Product.find(query).lean();
  res.json({ success: true, data: products });
}));

// GET /api/products/:id - retrieve one
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.id }).lean();
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
}));

// POST /api/products - create
router.post('/', asyncHandler(async (req, res) => {
  const now = new Date().toISOString();
  const expiry = req.body.expiryDate || computeExpiry(req.body.purchaseDate, req.body.warrantyMonths);
  const product = new Product({
    ...req.body,
    expiryDate: expiry,
    status: computeStatus(expiry),
    createdAt: now,
    updatedAt: now,
  });
  await product.save();
  res.status(201).json({ success: true, data: product });
}));

// PUT /api/products/:id - replace
router.put('/:id', asyncHandler(async (req, res) => {
  const expiry = req.body.expiryDate || computeExpiry(req.body.purchaseDate, req.body.warrantyMonths);
  const updated = await Product.findOneAndUpdate(
    { id: req.params.id },
    { ...req.body, expiryDate: expiry, status: computeStatus(expiry), updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: updated });
}));

// PATCH /api/products/:id - partial update
router.patch('/:id', asyncHandler(async (req, res) => {
  const existing = await Product.findOne({ id: req.params.id }).lean();
  if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });
  const merged = { ...existing, ...req.body };
  const expiry = merged.expiryDate || computeExpiry(merged.purchaseDate, merged.warrantyMonths);
  const updated = await Product.findOneAndUpdate(
    { id: req.params.id },
    { ...req.body, expiryDate: expiry, status: computeStatus(expiry), updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  res.json({ success: true, data: updated });
}));

// DELETE /api/products/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Product.findOneAndDelete({ id: req.params.id }).lean();
  if (!deleted) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: { id: req.params.id, deleted: true } });
}));

// Helper functions (duplicate from original controller)
function computeExpiry(purchaseDate, warrantyMonths) {
  const d = new Date(purchaseDate);
  d.setMonth(d.getMonth() + warrantyMonths);
  return d.toISOString().split('T')[0];
}
function computeStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const msLeft = expiry - today;
  const daysLeft = msLeft / (1000 * 60 * 60 * 24);
  if (daysLeft < 0) return 'expired';
  if (daysLeft < 30) return 'expiring';
  return 'active';
}

module.exports = router;
