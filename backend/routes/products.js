'use strict';
const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Document = require('../models/document');
const ServiceRecord = require('../models/serviceRecord');
const User = require('../models/user');
const { generateId } = require('../utils/idGen');
const { requireAuth, isAdmin, asyncHandler } = require('../middleware/auth');
const { latestValidToday, isValidDateString } = require('../utils/dates');

router.use(requireAuth);

const EDITABLE = ['name', 'brand', 'model', 'category', 'purchaseDate', 'warrantyMonths', 'expiryDate',
  'price', 'retailer', 'serialNumber', 'invoiceNumber', 'notes'];

function pick(body) {
  const out = {};
  EDITABLE.forEach((k) => { if (body[k] !== undefined) out[k] = body[k]; });
  if (out.price !== undefined) out.price = Math.max(0, parseFloat(out.price) || 0);
  if (out.warrantyMonths !== undefined) out.warrantyMonths = parseInt(out.warrantyMonths, 10) || 0;
  return out;
}

function validate(p) {
  if (!p.name || !String(p.name).trim()) return 'Product name is required';
  if (!p.category) return 'Category is required';
  if (!isValidDateString(p.purchaseDate)) return 'A valid purchase date is required';
  if (p.purchaseDate > latestValidToday()) return 'Purchase date cannot be in the future';
  if (!(p.warrantyMonths > 0)) return 'Warranty period must be at least 1 month';
  return null;
}

// Owner check: a user can only touch their own products; admin can touch all
async function findAccessible(req, id) {
  const product = await Product.findOne({ id }).lean();
  if (!product) return null;
  if (!isAdmin(req) && product.userId !== req.user.id) return null;
  return product;
}

// GET /api/products — own products (admin: every user's products + owner info)
router.get('/', asyncHandler(async (req, res) => {
  const query = isAdmin(req) ? {} : { userId: req.user.id };
  if (isAdmin(req) && req.query.userId) query.userId = req.query.userId;
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();

  if (isAdmin(req)) {
    const owners = await User.find({ id: { $in: [...new Set(products.map((p) => p.userId))] } }).lean();
    const byId = Object.fromEntries(owners.map((u) => [u.id, u]));
    products.forEach((p) => {
      const o = byId[p.userId];
      p.ownerName = o ? (o.name || o.username) : 'Deleted user';
      p.ownerEmail = o ? o.email : '';
    });
  }
  res.json({ success: true, data: products.map(withStatus) });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await findAccessible(req, req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: withStatus(product) });
}));

// POST /api/products
router.post('/', asyncHandler(async (req, res) => {
  const data = pick(req.body);
  const problem = validate(data);
  if (problem) return res.status(400).json({ success: false, error: problem });

  const now = new Date().toISOString();
  const expiry = computeExpiry(data.purchaseDate, data.warrantyMonths);
  const owner = req.userDoc;
  const product = new Product({
    ...data,
    id: generateId('prod'),
    userId: req.user.id,
    currency: (owner.settings && owner.settings.currency) || 'USD',
    expiryDate: expiry,
    status: computeStatus(expiry),
    createdAt: now,
    updatedAt: now,
  });
  await product.save();
  res.status(201).json({ success: true, data: product.toObject() });
}));

// PUT / PATCH /api/products/:id
const update = asyncHandler(async (req, res) => {
  const existing = await findAccessible(req, req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });

  const merged = { ...existing, ...pick(req.body) };
  const problem = validate(merged);
  if (problem) return res.status(400).json({ success: false, error: problem });

  const expiry = computeExpiry(merged.purchaseDate, merged.warrantyMonths);
  const updated = await Product.findOneAndUpdate(
    { id: req.params.id },
    { ...pick(req.body), expiryDate: expiry, status: computeStatus(expiry), updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();

  if (merged.name !== existing.name) {
    await Promise.all([
      Document.updateMany({ productId: existing.id }, { productName: merged.name }),
      ServiceRecord.updateMany({ productId: existing.id }, { productName: merged.name }),
    ]);
  }
  res.json({ success: true, data: updated });
});
router.put('/:id', update);
router.patch('/:id', update);

// DELETE /api/products/:id — also removes its documents & service records
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = await findAccessible(req, req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });
  await Promise.all([
    Product.deleteOne({ id: existing.id }),
    Document.deleteMany({ productId: existing.id }),
    ServiceRecord.deleteMany({ productId: existing.id }),
  ]);
  res.json({ success: true, data: { id: existing.id, deleted: true } });
}));

function computeExpiry(purchaseDate, warrantyMonths) {
  const d = new Date(`${purchaseDate}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + Number(warrantyMonths));
  return d.toISOString().split('T')[0];
}

function computeStatus(expiryDate) {
  const daysLeft = (new Date(`${expiryDate}T00:00:00Z`) - Date.now()) / 86400000;
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring';
  return 'active';
}

// Status is time-dependent, so refresh it on every read
function withStatus(p) {
  return p.expiryDate ? { ...p, status: computeStatus(p.expiryDate) } : p;
}

module.exports = router;
