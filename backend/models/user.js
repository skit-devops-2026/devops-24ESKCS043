'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const settingsSchema = new mongoose.Schema({
  currency:     { type: String, default: 'USD' },
  dateFormat:   { type: String, default: 'MMM DD, YYYY' },
  notify7Days:  { type: Boolean, default: true },
  notify15Days: { type: Boolean, default: true },
  notify30Days: { type: Boolean, default: true },
  emailDigest:  { type: Boolean, default: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  settings: { type: settingsSchema, default: () => ({}) },
  createdAt: { type: String },
  updatedAt: { type: String },
});

userSchema.methods.setPassword = function (pwd) {
  this.passwordHash = bcrypt.hashSync(pwd, 10);
};

userSchema.methods.validatePassword = function (pwd) {
  return bcrypt.compareSync(pwd, this.passwordHash);
};

userSchema.methods.generateJwt = function () {
  const payload = { id: this.id, username: this.username, role: this.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/** Public profile — never exposes the password hash */
userSchema.methods.toProfile = function () {
  return toProfile(this);
};

function toProfile(u) {
  return {
    id: u.id,
    username: u.username,
    name: u.name || u.username,
    email: u.email || '',
    phone: u.phone || '',
    role: u.role === 'admin' ? 'Admin' : 'User',
    status: u.status || 'Active',
    settings: {
      currency: 'USD', dateFormat: 'MMM DD, YYYY',
      notify7Days: true, notify15Days: true, notify30Days: true, emailDigest: true,
      ...((u.settings && (u.settings.toObject ? u.settings.toObject() : u.settings)) || {}),
    },
    joinedDate: u.createdAt || '',
  };
}

const User = mongoose.model('User', userSchema);
User.toProfile = toProfile;
module.exports = User;
