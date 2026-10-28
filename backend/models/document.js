'use strict';
const mongoose = require('mongoose');

// Uploaded file is stored inside MongoDB (Buffer). Max ~10 MB per file,
// well under MongoDB's 16 MB document limit.
const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  productName: { type: String, default: '' },
  name: { type: String, required: true },
  type: { type: String, default: 'Receipt' },
  mimeType: { type: String, default: 'application/octet-stream' },
  sizeBytes: { type: Number, default: 0 },
  size: { type: String, default: '' },
  uploadDate: { type: String },
  data: { type: Buffer, required: true, select: false },
  createdAt: { type: String },
});

module.exports = mongoose.model('Document', documentSchema);
