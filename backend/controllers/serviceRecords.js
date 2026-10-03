/**
 * serviceRecords.js — CRUD controller for /api/service-records
 *
 * GET    /api/service-records             → list all (supports ?productId=, ?status=)
 * GET    /api/service-records/:id         → get one
 * POST   /api/service-records             → create
 * PUT    /api/service-records/:id         → full replace
 * PATCH  /api/service-records/:id         → partial update
 * DELETE /api/service-records/:id         → delete
 */

'use strict';

const store      = require('../utils/fileStore');
const { ok, created, notFound, badRequest, error } = require('../utils/response');
const { parseBody }  = require('../utils/parseBody');
const { generateId } = require('../utils/idGen');

const COLLECTION = 'serviceRecords';

async function list(_req, res, _params, query) {
  try {
    let records = store.getCollection(COLLECTION);
    if (query.productId) records = records.filter(r => r.productId === query.productId);
    if (query.status)    records = records.filter(r => r.status    === query.status);
    ok(res, records);
  } catch (err) {
    error(res, err.message);
  }
}

async function getOne(_req, res, params) {
  try {
    const record = store.findById(COLLECTION, params.id);
    if (!record) return notFound(res, `Service record ${params.id} not found`);
    ok(res, record);
  } catch (err) {
    error(res, err.message);
  }
}

async function create(req, res) {
  try {
    const body = await parseBody(req);
    if (!body.productId) return badRequest(res, 'Missing required field: productId');
    if (!body.issue)     return badRequest(res, 'Missing required field: issue');
    if (!body.center)    return badRequest(res, 'Missing required field: center');

    // Resolve product name if not supplied
    let productName = body.productName || '';
    if (!productName) {
      const product = store.findById('products', body.productId);
      productName   = product ? product.name : body.productId;
    }

    const record = {
      id:          generateId('srv'),
      productId:   body.productId,
      productName,
      date:        body.date   || new Date().toISOString().split('T')[0],
      center:      body.center,
      issue:       body.issue,
      cost:        body.cost   || 0,
      status:      body.status || 'Pending',
      notes:       body.notes  || '',
      createdAt:   new Date().toISOString(),
    };
    store.insert(COLLECTION, record);
    created(res, record);
  } catch (err) {
    error(res, err.message);
  }
}

async function replace(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Service record ${params.id} not found`);

    const body = await parseBody(req);
    if (!body.productId || !body.issue || !body.center) {
      return badRequest(res, 'productId, issue, and center are required');
    }
    const updated = store.update(COLLECTION, params.id, body);
    ok(res, updated);
  } catch (err) {
    error(res, err.message);
  }
}

async function patch(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Service record ${params.id} not found`);

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
    if (!deleted) return notFound(res, `Service record ${params.id} not found`);
    ok(res, { id: params.id, deleted: true });
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { list, getOne, create, replace, patch, remove };
