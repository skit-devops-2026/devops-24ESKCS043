/**
 * idGen.js — Lightweight unique-ID generator
 * Format: <prefix>-<timestamp-base36><random-base36>
 * e.g., prod-m2k9x4qr7
 */

'use strict';

function generateId(prefix = 'id') {
  const ts  = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${ts}${rnd}`;
}

module.exports = { generateId };
