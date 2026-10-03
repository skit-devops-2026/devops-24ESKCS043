/**
 * fileStore.js — Atomic JSON file-based data store
 * Reads and writes `data/db.json` as the backend's persistent layer.
 * Uses fs.writeFileSync with a temp-file swap to avoid corruption.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const DB_PATH  = path.join(__dirname, '..', 'data', 'db.json');
const TMP_PATH = DB_PATH + '.tmp';

/** Load the entire database from disk */
function load() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // First run — return empty skeleton
      return { products: [], categories: [], users: [], serviceRecords: [], documents: [] };
    }
    throw new Error(`fileStore.load failed: ${err.message}`);
  }
}

/** Persist the entire database to disk (atomic via temp file) */
function save(db) {
  const json = JSON.stringify(db, null, 2);
  fs.writeFileSync(TMP_PATH, json, 'utf8');
  fs.renameSync(TMP_PATH, DB_PATH);
}

/** Read a single collection by name */
function getCollection(name) {
  const db = load();
  if (!Array.isArray(db[name])) {
    throw new Error(`Collection "${name}" not found`);
  }
  return db[name];
}

/** Write a single collection back to disk */
function setCollection(name, data) {
  const db = load();
  db[name] = data;
  save(db);
}

/** Find a single record by id within a collection */
function findById(collection, id) {
  return getCollection(collection).find(r => r.id === id) || null;
}

/** Insert a new record into a collection */
function insert(collection, record) {
  const db   = load();
  const col  = db[collection] || [];
  col.push(record);
  db[collection] = col;
  save(db);
  return record;
}

/** Update a record by id in a collection */
function update(collection, id, patch) {
  const db   = load();
  const col  = db[collection] || [];
  const idx  = col.findIndex(r => r.id === id);
  if (idx === -1) return null;
  col[idx] = { ...col[idx], ...patch, updatedAt: new Date().toISOString() };
  db[collection] = col;
  save(db);
  return col[idx];
}

/** Delete a record by id from a collection */
function remove(collection, id) {
  const db    = load();
  const col   = db[collection] || [];
  const idx   = col.findIndex(r => r.id === id);
  if (idx === -1) return false;
  col.splice(idx, 1);
  db[collection] = col;
  save(db);
  return true;
}

module.exports = { load, save, getCollection, setCollection, findById, insert, update, remove };
