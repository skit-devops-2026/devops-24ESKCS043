'use strict';
const express = require('express');
const router = express.Router();

const Document = require('../models/document');
const Product = require('../models/product');
const { generateId } = require('../utils/idGen');
const { requireAuth, isAdmin, asyncHandler } = require('../middleware/auth');

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = [
  'application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
  'text/plain',
];
const TYPES = ['Receipt', 'Invoice', 'Warranty Card', 'Service Invoice', 'Manual', 'Other'];

router.use(requireAuth);

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function findAccessible(req, id, withData = false) {
  const q = Document.findOne({ id });
  if (withData) q.select('+data');
  const doc = await q.lean();
  if (!doc) return null;
  if (!isAdmin(req) && doc.userId !== req.user.id) return null;
  return doc;
}

// GET /api/documents?productId= — metadata only (no file bytes)
router.get('/', asyncHandler(async (req, res) => {
  const query = isAdmin(req) ? {} : { userId: req.user.id };
  if (req.query.productId) query.productId = req.query.productId;
  const docs = await Document.find(query).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: docs });
}));

// POST /api/documents  { productId, name, type, mimeType, dataBase64 }
router.post('/', asyncHandler(async (req, res) => {
  const { productId, name, type, mimeType, dataBase64 } = req.body;
  if (!productId) return res.status(400).json({ success: false, error: 'Select a product for this document' });
  if (!dataBase64) return res.status(400).json({ success: false, error: 'Please choose a file to upload' });

  const product = await Product.findOne({ id: productId }).lean();
  if (!product || (product.userId !== req.user.id)) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  const mime = (mimeType || '').toLowerCase();
  if (!ALLOWED_MIME.includes(mime)) {
    return res.status(400).json({ success: false, error: 'Only PDF, image (PNG/JPG/WEBP/GIF) or text files are allowed' });
  }
  const buffer = Buffer.from(String(dataBase64).replace(/^data:[^;]+;base64,/, ''), 'base64');
  if (!buffer.length) return res.status(400).json({ success: false, error: 'The file is empty' });
  if (buffer.length > MAX_BYTES) return res.status(413).json({ success: false, error: 'File is larger than 10 MB' });

  const now = new Date().toISOString();
  const doc = new Document({
    id: generateId('doc'),
    userId: req.user.id,
    productId,
    productName: product.name,
    name: String(name || 'document').slice(0, 200),
    type: TYPES.includes(type) ? type : 'Other',
    mimeType: mime,
    sizeBytes: buffer.length,
    size: formatSize(buffer.length),
    uploadDate: now.split('T')[0],
    data: buffer,
    createdAt: now,
  });
  await doc.save();
  const { data, ...meta } = doc.toObject();
  res.status(201).json({ success: true, data: meta });
}));

// GET /api/documents/:id/file[?download=1] — the actual file bytes
router.get('/:id/file', asyncHandler(async (req, res) => {
  const doc = await findAccessible(req, req.params.id, true);
  if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });
  const bytes = Buffer.from(doc.data.buffer ? doc.data.buffer : doc.data);
  const disposition = req.query.download ? 'attachment' : 'inline';
  res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
  res.setHeader('Content-Length', bytes.length);
  res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(doc.name)}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(bytes);
}));

// DELETE /api/documents/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const doc = await findAccessible(req, req.params.id);
  if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });
  await Document.deleteOne({ id: doc.id });
  res.json({ success: true, data: { id: doc.id, deleted: true } });
}));

module.exports = router;
