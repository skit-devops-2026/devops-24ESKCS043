'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verifies the JWT, then re-loads the user so deleted / suspended
// accounts and role changes take effect immediately.
async function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Session expired — please log in again' });
  }
  try {
    const user = await User.findOne({ id: payload.id });
    if (!user) return res.status(401).json({ success: false, error: 'Account no longer exists' });
    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, error: 'Account is suspended' });
    }
    req.user = { id: user.id, username: user.username, role: user.role };
    req.userDoc = user;
    next();
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin role required' });
  }
  next();
}

const isAdmin = (req) => req.user && req.user.role === 'admin';

// Wraps async route handlers so thrown errors reach the error middleware
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { requireAuth, requireAdmin, isAdmin, asyncHandler };
