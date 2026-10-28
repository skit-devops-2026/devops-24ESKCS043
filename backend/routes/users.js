'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const Document = require('../models/document');
const ServiceRecord = require('../models/serviceRecord');
const { generateId } = require('../utils/idGen');
const { requireAuth, requireAdmin, asyncHandler } = require('../middleware/auth');

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function slugUsername(name, email) {
  const base = (name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    || (email || '').split('@')[0].toLowerCase();
  return base || 'user';
}

async function uniqueUsername(base) {
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await User.exists({ username: candidate })) {
    n += 1;
    candidate = `${base}_${n}`;
  }
  return candidate;
}

async function createUser({ name, email, password }) {
  const now = new Date().toISOString();
  const user = new User({
    id: generateId('usr'),
    username: await uniqueUsername(slugUsername(name, email)),
    name: (name || '').trim(),
    email: email.toLowerCase().trim(),
    role: 'user', // public sign-up can never create an admin
    status: 'Active',
    createdAt: now,
    updatedAt: now,
  });
  user.setPassword(password);
  await user.save();
  return user;
}

function validateNewAccount({ name, email, password }) {
  if (!email || !EMAIL_RE.test(email)) return 'A valid email address is required';
  if (!password || password.length < 6) return 'Password must be at least 6 characters';
  if (name && name.length > 80) return 'Name is too long';
  return null;
}

// ---------- Public ----------

// POST /api/users/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const problem = validateNewAccount({ name, email, password });
  if (problem) return res.status(400).json({ success: false, error: problem });

  if (await User.exists({ email: email.toLowerCase().trim() })) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists' });
  }
  const user = await createUser({ name, email, password });
  res.status(201).json({ success: true, data: { token: user.generateJwt(), user: user.toProfile() } });
}));

// POST /api/users/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  const clean = email.toLowerCase().trim();
  // older accounts may have been saved with capital letters in the email
  const user = await User.findOne({ email: clean })
    || await User.findOne({ email: new RegExp(`^${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
  if (!user || !user.validatePassword(password)) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
  if (user.status === 'Suspended') {
    return res.status(403).json({ success: false, error: 'This account has been suspended. Contact support.' });
  }
  res.json({ success: true, data: { token: user.generateJwt(), user: user.toProfile() } });
}));

// ---------- Logged-in user ----------

// GET /api/users/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: req.userDoc.toProfile() });
});

// PATCH /api/users/me — profile & preferences
router.patch('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = req.userDoc;
  const { name, email, phone, settings } = req.body;

  if (name !== undefined) {
    if (!String(name).trim()) return res.status(400).json({ success: false, error: 'Name cannot be empty' });
    user.name = String(name).trim();
  }
  if (email !== undefined && email.toLowerCase().trim() !== user.email) {
    if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, error: 'Invalid email address' });
    if (await User.exists({ email: email.toLowerCase().trim(), id: { $ne: user.id } })) {
      return res.status(409).json({ success: false, error: 'That email is already used by another account' });
    }
    user.email = email.toLowerCase().trim();
  }
  if (phone !== undefined) {
    const p = String(phone).trim();
    if (p && !/^[+\d][\d\s()-]{5,19}$/.test(p)) {
      return res.status(400).json({ success: false, error: 'Phone number looks invalid' });
    }
    user.phone = p;
  }

  let currencyChanged = false;
  if (settings && typeof settings === 'object') {
    const current = user.settings ? user.settings.toObject() : {};
    const next = { ...current };
    if (settings.currency !== undefined) {
      if (!CURRENCIES.includes(settings.currency)) {
        return res.status(400).json({ success: false, error: 'Unsupported currency' });
      }
      currencyChanged = settings.currency !== current.currency;
      next.currency = settings.currency;
    }
    ['notify7Days', 'notify15Days', 'notify30Days', 'emailDigest'].forEach((k) => {
      if (settings[k] !== undefined) next[k] = !!settings[k];
    });
    if (settings.dateFormat) next.dateFormat = String(settings.dateFormat);
    user.settings = next;
  }

  user.updatedAt = new Date().toISOString();
  await user.save();

  // Keep every product of this user in the account currency
  if (currencyChanged) {
    await Product.updateMany({ userId: user.id }, { $set: { currency: user.settings.currency } });
  }
  res.json({ success: true, data: user.toProfile() });
}));

// POST /api/users/me/password — requires the correct current password
router.post('/me/password', requireAuth, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.userDoc;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Current and new password are required' });
  }
  if (!user.validatePassword(currentPassword)) {
    return res.status(400).json({ success: false, error: 'Current password is incorrect' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
  }
  if (currentPassword === newPassword) {
    return res.status(400).json({ success: false, error: 'New password must be different from the current one' });
  }
  user.setPassword(newPassword);
  user.updatedAt = new Date().toISOString();
  await user.save();
  res.json({ success: true, data: { changed: true } });
}));

// ---------- Admin only ----------

// GET /api/users — every registered account with usage stats
router.get('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const [users, productCounts, docCounts] = await Promise.all([
    User.find({}).lean(),
    Product.aggregate([{ $group: { _id: '$userId', n: { $sum: 1 } } }]),
    Document.aggregate([{ $group: { _id: '$userId', n: { $sum: 1 } } }]),
  ]);
  const pc = Object.fromEntries(productCounts.map((r) => [r._id, r.n]));
  const dc = Object.fromEntries(docCounts.map((r) => [r._id, r.n]));
  const data = users.map((u) => ({
    ...User.toProfile(u),
    productsCount: pc[u.id] || 0,
    documentsCount: dc[u.id] || 0,
  }));
  res.json({ success: true, data });
}));

// POST /api/users — admin creates a regular user account
router.post('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const problem = validateNewAccount({ name, email, password });
  if (problem) return res.status(400).json({ success: false, error: problem });
  if (await User.exists({ email: email.toLowerCase().trim() })) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists' });
  }
  const user = await createUser({ name, email, password });
  res.status(201).json({ success: true, data: { ...user.toProfile(), productsCount: 0, documentsCount: 0 } });
}));

// PATCH /api/users/:id — admin can suspend / re-activate a user
router.patch('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'You cannot change your own admin account here' });
  }
  const user = await User.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  const { status } = req.body;
  if (status !== undefined) {
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    user.status = status;
  }
  user.updatedAt = new Date().toISOString();
  await user.save();
  res.json({ success: true, data: user.toProfile() });
}));

// DELETE /api/users/:id — admin removes a user and all their data
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'You cannot delete the admin account' });
  }
  const deleted = await User.findOneAndDelete({ id: req.params.id }).lean();
  if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
  await Promise.all([
    Product.deleteMany({ userId: req.params.id }),
    Document.deleteMany({ userId: req.params.id }),
    ServiceRecord.deleteMany({ userId: req.params.id }),
  ]);
  res.json({ success: true, data: { id: req.params.id, deleted: true } });
}));

module.exports = router;
