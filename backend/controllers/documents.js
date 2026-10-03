/**
 * documents.js — CRUD controller for /api/documents
 *
 * GET    /api/documents            → list all (supports ?productId=, ?type=)
 * GET    /api/documents/:id        → get one
 * POST   /api/documents            → create (metadata only — no actual file upload)
 * PATCH  /api/documents/:id        → partial update
 * DELETE /api/documents/:id        → delete
 */

'use strict';

const store      = require('../utils/fileStore');
const { ok, created, notFound, badRequest, error } = require('../utils/response');
const { parseBody }  = require('../utils/parseBody');
const { generateId } = require('../utils/idGen');

const COLLECTION = 'documents';

const VALID_TYPES = ['Receipt', 'Invoice', 'Warranty Card', 'Manual', 'Service Report', 'Other'];

async function list(_req, res, _params, query) {
  try {
    let docs = store.getCollection(COLLECTION);
    if (query.productId) docs = docs.filter(d => d.productId === query.productId);
    if (query.type)      docs = docs.filter(d => d.type      === query.type);
    ok(res, docs);
  } catch (err) {
    error(res, err.message);
  }
}

async function getOne(_req, res, params) {
  try {
    const doc = store.findById(COLLECTION, params.id);
    if (!doc) return notFound(res, `Document ${params.id} not found`);
    ok(res, doc);
  } catch (err) {
    error(res, err.message);
  }
}

async function create(req, res) {
  try {
    const body = await parseBody(req);
    if (!body.productId) return badRequest(res, 'Missing required field: productId');
    if (!body.name)      return badRequest(res, 'Missing required field: name');
    if (!body.type)      return badRequest(res, 'Missing required field: type');
    if (!VALID_TYPES.includes(body.type)) {
      return badRequest(res, `type must be one of: ${VALID_TYPES.join(', ')}`);
    }

    // Resolve product name
    let productName = body.productName || '';
    if (!productName) {
      const product = store.findById('products', body.productId);
      productName   = product ? product.name : body.productId;
    }

    const doc = {
      id:          generateId('doc'),
      productId:   body.productId,
      productName,
      name:        body.name,
      type:        body.type,
      size:        body.size        || 'Unknown',
      uploadDate:  body.uploadDate  || new Date().toISOString().split('T')[0],
      url:         body.url         || null,
    };
    store.insert(COLLECTION, doc);
    created(res, doc);
  } catch (err) {
    error(res, err.message);
  }
}

async function patch(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Document ${params.id} not found`);

    const body = await parseBody(req);
    if (body.type && !VALID_TYPES.includes(body.type)) {
      return badRequest(res, `type must be one of: ${VALID_TYPES.join(', ')}`);
    }
    const updated = store.update(COLLECTION, params.id, body);
    ok(res, updated);
  } catch (err) {
    error(res, err.message);
  }
}

async function remove(_req, res, params) {
  try {
    const deleted = store.remove(COLLECTION, params.id);
    if (!deleted) return notFound(res, `Document ${params.id} not found`);
    ok(res, { id: params.id, deleted: true });
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { list, getOne, create, patch, remove };
