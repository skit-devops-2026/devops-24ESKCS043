/**
 * parseBody.js — Reads the full request body and parses it as JSON
 */

'use strict';

/** Returns a Promise that resolves to the parsed JSON body */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw.trim()) { resolve({}); return; }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON in request body'));
      }
    });
    req.on('error', reject);
  });
}

module.exports = { parseBody };
