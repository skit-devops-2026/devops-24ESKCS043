'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: String },
  updatedAt: { type: String },
});

// Virtual for password set
userSchema.virtual('password')
  .set(function (pwd) {
    this.passwordHash = bcrypt.hashSync(pwd, 10);
  });

userSchema.methods.validatePassword = function (pwd) {
  return bcrypt.compareSync(pwd, this.passwordHash);
};

// Generate JWT token for the user
userSchema.methods.generateJwt = function () {
  const payload = { id: this.id, username: this.username, role: this.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = mongoose.model('User', userSchema);

// Duplicate user model removed – original definition retained above
