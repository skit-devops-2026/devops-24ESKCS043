'use strict';
const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Helper async handler
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// GET /api/categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({}).lean();
  res.json({ success: true, data: categories });
}));

// GET /api/categories/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const cat = await Category.findOne({ id: req.params.id }).lean();
  if (!cat) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data: cat });
}));

// POST /api/categories
router.post('/', asyncHandler(async (req, res) => {
  const now = new Date().toISOString();
  const category = new Category({ ...req.body, createdAt: now, updatedAt: now });
  await category.save();
  res.status(201).json({ success: true, data: category });
}));

// PUT /api/categories/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const updated = await Category.findOneAndUpdate({ id: req.params.id }, { ...req.body, updatedAt: new Date().toISOString() }, { new: true }).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data: updated });
}));

// PATCH /api/categories/:id
router.patch('/:id', asyncHandler(async (req, res) => {
  const updated = await Category.findOneAndUpdate({ id: req.params.id }, { ...req.body, updatedAt: new Date().toISOString() }, { new: true }).lean();
  if (!updated) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data: updated });
}));

// DELETE /api/categories/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Category.findOneAndDelete({ id: req.params.id }).lean();
  if (!deleted) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data: { id: req.params.id, deleted: true } });
}));

module.exports = router;
