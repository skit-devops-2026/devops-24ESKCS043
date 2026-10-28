'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const productRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const userRouter = require('./routes/users');
const documentRouter = require('./routes/documents');
const serviceRecordRouter = require('./routes/serviceRecords');
const { ensureAdmin, ensureCategories } = require('./utils/seed');

const app = express();

app.use(cors());
// Large limit only for document uploads (base64 file content)
app.use('/api/documents', express.json({ limit: '15mb' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Warranty Vault API',
    version: '1.1.0',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/users', userRouter);
app.use('/api/documents', documentRouter);
app.use('/api/service-records', serviceRecordRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'File is too large (max 10 MB)' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Duplicate value — this record already exists' });
  }
  console.error(err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set in backend/.env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await ensureAdmin();
    await ensureCategories();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
