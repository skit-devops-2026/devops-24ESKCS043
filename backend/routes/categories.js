'use strict';
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { generateId } = require('../utils/idGen');
const { requireAuth, requireAdmin, asyncHandler } = require('../middleware/auth');

// Anyone logged in can read categories; only the admin can change them
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: 1 }).lean();
  res.json({ success: true, data: categories });
}));

router.post('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ success: false, error: 'Category name is required' });
  if (await Category.exists({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })) {
    return res.status(409).json({ success: false, error: 'Category already exists' });
  }
  const now = new Date().toISOString();
  const category = await Category.create({
    id: generateId('cat'),
    name,
    description: req.body.description || '',
    icon: req.body.icon || '',
    defaultWarrantyMonths: parseInt(req.body.defaultWarrantyMonths, 10) || 12,
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json({ success: true, data: category.toObject() });
}));

router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const deleted = await Category.findOneAndDelete({ id: req.params.id }).lean();
  if (!deleted) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data: { id: req.params.id, deleted: true } });
}));

module.exports = router;
