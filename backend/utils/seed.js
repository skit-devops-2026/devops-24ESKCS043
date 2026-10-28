'use strict';
const User = require('../models/user');
const Category = require('../models/category');
const { generateId } = require('./idGen');

const DEFAULT_CATEGORIES = [
  { name: 'Phones', icon: 'Smartphone', defaultWarrantyMonths: 24, description: 'Smartphones, mobile devices & cases' },
  { name: 'Laptops', icon: 'Laptop', defaultWarrantyMonths: 12, description: 'MacBooks, Windows PCs & workstations' },
  { name: 'Appliances', icon: 'Refrigerator', defaultWarrantyMonths: 36, description: 'Refrigerators, vacuums & kitchen equipment' },
  { name: 'Electronics', icon: 'Tv', defaultWarrantyMonths: 24, description: 'Smart TVs, audio systems, cameras' },
  { name: 'Furniture', icon: 'Armchair', defaultWarrantyMonths: 60, description: 'Ergonomic chairs, desks & home furnishings' },
  { name: 'Gadgets', icon: 'Watch', defaultWarrantyMonths: 12, description: 'Smartwatches, fitness bands & accessories' },
  { name: 'Automobiles', icon: 'Car', defaultWarrantyMonths: 48, description: 'Cars, bikes & automotive accessories' },
];

/**
 * Exactly one admin account: the one configured by ADMIN_EMAIL / ADMIN_PASSWORD.
 * - Created on first start if it does not exist.
 * - Any other account that somehow has role "admin" is demoted to "user".
 */
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — no admin account configured');
    return;
  }
  await User.updateMany({ role: 'admin', email: { $ne: email } }, { $set: { role: 'user' } });

  let admin = await User.findOne({ email });
  const now = new Date().toISOString();
  if (!admin) {
    admin = new User({
      id: generateId('usr'),
      username: 'admin',
      name: process.env.ADMIN_NAME || 'System Administrator',
      email,
      role: 'admin',
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    });
    if (await User.exists({ username: 'admin' })) admin.username = `admin_${Date.now().toString(36)}`;
    admin.setPassword(password);
    await admin.save();
    console.log(`👤 Admin account created: ${email}`);
  } else if (admin.role !== 'admin' || admin.status !== 'Active') {
    admin.role = 'admin';
    admin.status = 'Active';
    await admin.save();
  }
}

async function ensureCategories() {
  if (await Category.countDocuments() > 0) return;
  const now = new Date().toISOString();
  await Category.insertMany(DEFAULT_CATEGORIES.map((c) => ({ ...c, id: generateId('cat'), createdAt: now, updatedAt: now })));
  console.log('🏷️  Default categories created');
}

module.exports = { ensureAdmin, ensureCategories };
