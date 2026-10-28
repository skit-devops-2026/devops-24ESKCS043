'use strict';
const express = require('express');
const router = express.Router();

const ServiceRecord = require('../models/serviceRecord');
const Product = require('../models/product');
const { generateId } = require('../utils/idGen');
const { requireAuth, isAdmin, asyncHandler } = require('../middleware/auth');
const { latestValidToday, isValidDateString } = require('../utils/dates');

router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const query = isAdmin(req) ? {} : { userId: req.user.id };
  if (req.query.productId) query.productId = req.query.productId;
  const records = await ServiceRecord.find(query).sort({ date: -1, createdAt: -1 }).lean();
  res.json({ success: true, data: records });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { productId, center, issue, cost, status, date, notes } = req.body;
  const product = await Product.findOne({ id: productId }).lean();
  if (!product || product.userId !== req.user.id) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  if (!issue || !String(issue).trim()) return res.status(400).json({ success: false, error: 'Describe the service issue' });
  const day = date || new Date().toISOString().split('T')[0];
  if (!isValidDateString(day) || day > latestValidToday()) {
    return res.status(400).json({ success: false, error: 'Service date cannot be in the future' });
  }
  const now = new Date().toISOString();
  const record = await ServiceRecord.create({
    id: generateId('srv'),
    userId: req.user.id,
    productId,
    productName: product.name,
    date: day,
    center: String(center || 'Brand Official Service Center'),
    issue: String(issue),
    cost: Math.max(0, parseFloat(cost) || 0),
    status: status || 'Completed',
    notes: notes || '',
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json({ success: true, data: record.toObject() });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const rec = await ServiceRecord.findOne({ id: req.params.id }).lean();
  if (!rec || (!isAdmin(req) && rec.userId !== req.user.id)) {
    return res.status(404).json({ success: false, error: 'Service record not found' });
  }
  await ServiceRecord.deleteOne({ id: rec.id });
  res.json({ success: true, data: { id: rec.id, deleted: true } });
}));

module.exports = router;
