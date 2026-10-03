/**
 * categories.js — CRUD controller for /api/categories
 *
 * GET    /api/categories        → list all
 * GET    /api/categories/:id    → get one
 * POST   /api/categories        → create
 * PUT    /api/categories/:id    → full replace
 * PATCH  /api/categories/:id    → partial update
 * DELETE /api/categories/:id    → delete
 */

'use strict';

const store      = require('../utils/fileStore');
const { ok, created, notFound, badRequest, error } = require('../utils/response');
const { parseBody }  = require('../utils/parseBody');
const { generateId } = require('../utils/idGen');

const COLLECTION = 'categories';

async function list(_req, res) {
  try {
    ok(res, store.getCollection(COLLECTION));
  } catch (err) {
    error(res, err.message);
  }
}

async function getOne(_req, res, params) {
  try {
    const cat = store.findById(COLLECTION, params.id);
    if (!cat) return notFound(res, `Category ${params.id} not found`);
    ok(res, cat);
  } catch (err) {
    error(res, err.message);
  }
}

async function create(req, res) {
  try {
    const body = await parseBody(req);
    if (!body.name) return badRequest(res, 'Missing required field: name');

    const cat = {
      id:                   generateId('cat'),
      name:                 body.name,
      icon:                 body.icon                 || 'Tag',
      defaultWarrantyMonths:body.defaultWarrantyMonths|| 12,
      description:          body.description          || '',
    };
    store.insert(COLLECTION, cat);
    created(res, cat);
  } catch (err) {
    error(res, err.message);
  }
}

async function replace(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Category ${params.id} not found`);

    const body = await parseBody(req);
    if (!body.name) return badRequest(res, 'Missing required field: name');

    const updated = store.update(COLLECTION, params.id, body);
    ok(res, updated);
  } catch (err) {
    error(res, err.message);
  }
}

async function patch(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Category ${params.id} not found`);

    const body    = await parseBody(req);
    const updated = store.update(COLLECTION, params.id, body);
    ok(res, updated);
  } catch (err) {
    error(res, err.message);
  }
}

async function remove(_req, res, params) {
  try {
    const deleted = store.remove(COLLECTION, params.id);
    if (!deleted) return notFound(res, `Category ${params.id} not found`);
    ok(res, { id: params.id, deleted: true });
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { list, getOne, create, replace, patch, remove };
