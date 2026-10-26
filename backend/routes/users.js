'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateId } = require('../utils/idGen');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'username and password required' });
    }
    const existing = await User.findOne({ username }).lean();
    if (existing) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }
    const now = new Date().toISOString();
    const user = new User({
      id: generateId('usr'),
      username,
      email,
      role: role || 'user',
      createdAt: now,
      updatedAt: now,
    });
    // set password via virtual
    user.password = password;
    await user.save();
    const token = user.generateJwt();
    res.status(201).json({ success: true, data: { id: user.id, username: user.username, role: user.role, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login - returns JWT
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!password || (!email && !username)) {
      return res.status(400).json({ success: false, error: 'email or username and password required' });
    }
    const query = email ? { email } : { username };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    if (!user.validatePassword(password)) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = user.generateJwt();
    res.json({ success: true, data: { token, id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all users – admin only
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find({}).lean();
  res.json({ success: true, data: users });
});

// Get own profile or any if admin
router.get('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  const user = await User.findOne({ id: req.params.id }).lean();
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

// Update own profile (or admin any)
router.patch('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  const update = { ...req.body, updatedAt: new Date().toISOString() };
  if (update.password) {
    // hash new password via virtual
    const tempUser = new User();
    tempUser.password = update.password;
    update.passwordHash = tempUser.passwordHash;
    delete update.password;
  }
  const user = await User.findOneAndUpdate({ id: req.params.id }, update, { new: true }).lean();
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

// Delete user – admin only
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const deleted = await User.findOneAndDelete({ id: req.params.id }).lean();
  if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: { id: req.params.id, deleted: true } });
});

module.exports = router;
