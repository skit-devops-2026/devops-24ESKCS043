/**
 * products.js — CRUD controller for /api/products
 *
 * GET    /api/products              → list all (supports ?userId=, ?category=, ?status=)
 * GET    /api/products/:id          → get one product
 * POST   /api/products              → create product
 * PUT    /api/products/:id          → full replace
 * PATCH  /api/products/:id          → partial update
 * DELETE /api/products/:id          → delete
 */

'use strict';

const store     = require('../utils/fileStore');
const { ok, created, notFound, badRequest, error } = require('../utils/response');
const { parseBody } = require('../utils/parseBody');
const { generateId }= require('../utils/idGen');

const COLLECTION = 'products';

const REQUIRED_FIELDS = ['name', 'brand', 'category', 'purchaseDate', 'warrantyMonths'];

function validate(body) {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] && body[field] !== 0) {
      return `Missing required field: ${field}`;
    }
  }
  if (typeof body.warrantyMonths !== 'number' || body.warrantyMonths < 1) {
    return 'warrantyMonths must be a positive integer';
  }
  return null;
}

function computeExpiry(purchaseDate, warrantyMonths) {
  const d = new Date(purchaseDate);
  d.setMonth(d.getMonth() + warrantyMonths);
  return d.toISOString().split('T')[0];
}

function computeStatus(expiryDate) {
  const today  = new Date();
  const expiry = new Date(expiryDate);
  const msLeft = expiry - today;
  const daysLeft = msLeft / (1000 * 60 * 60 * 24);
  if (daysLeft < 0)  return 'expired';
  if (daysLeft < 30) return 'expiring';
  return 'active';
}

/** Filter helper — applies query-string filters */
function applyFilters(products, query) {
  let result = products;
  if (query.userId)   result = result.filter(p => p.userId   === query.userId);
  if (query.category) result = result.filter(p => p.category === query.category);
  if (query.status)   result = result.filter(p => p.status   === query.status);
  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.brand  || '').toLowerCase().includes(q) ||
      (p.model  || '').toLowerCase().includes(q) ||
      (p.serialNumber || '').toLowerCase().includes(q)
    );
  }
  return result;
}

async function list(req, res, _params, query) {
  try {
    const all = store.getCollection(COLLECTION);
    // Recompute live statuses
    const refreshed = all.map(p => ({
      ...p,
      status: computeStatus(p.expiryDate),
    }));
    ok(res, applyFilters(refreshed, query));
  } catch (err) {
    error(res, err.message);
  }
}

async function getOne(req, res, params) {
  try {
    const product = store.findById(COLLECTION, params.id);
    if (!product) return notFound(res, `Product ${params.id} not found`);
    ok(res, { ...product, status: computeStatus(product.expiryDate) });
  } catch (err) {
    error(res, err.message);
  }
}

async function create(req, res) {
  try {
    const body = await parseBody(req);
    const validationError = validate(body);
    if (validationError) return badRequest(res, validationError);

    const now      = new Date().toISOString();
    const expiry   = body.expiryDate || computeExpiry(body.purchaseDate, body.warrantyMonths);
    const product  = {
      id:            generateId('prod'),
      name:          body.name,
      brand:         body.brand,
      model:         body.model         || '',
      category:      body.category,
      purchaseDate:  body.purchaseDate,
      warrantyMonths:body.warrantyMonths,
      expiryDate:    expiry,
      price:         body.price         || 0,
      currency:      body.currency      || 'USD',
      retailer:      body.retailer      || '',
      serialNumber:  body.serialNumber  || '',
      invoiceNumber: body.invoiceNumber || '',
      notes:         body.notes         || '',
      status:        computeStatus(expiry),
      userId:        body.userId        || 'guest',
      createdAt:     now,
      updatedAt:     now,
    };
    store.insert(COLLECTION, product);
    created(res, product);
  } catch (err) {
    error(res, err.message);
  }
}

async function replace(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Product ${params.id} not found`);

    const body = await parseBody(req);
    const validationError = validate(body);
    if (validationError) return badRequest(res, validationError);

    const expiry  = body.expiryDate || computeExpiry(body.purchaseDate, body.warrantyMonths);
    const updated = store.update(COLLECTION, params.id, {
      ...body,
      expiryDate: expiry,
      status:     computeStatus(expiry),
    });
    ok(res, updated);
  } catch (err) {
    error(res, err.message);
  }
}

async function patch(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `Product ${params.id} not found`);

    const body   = await parseBody(req);
    const merged = { ...existing, ...body };
    const expiry = merged.expiryDate || computeExpiry(merged.purchaseDate, merged.warrantyMonths);

    const updated = store.update(COLLECTION, params.id, {
      ...body,
      expiryDate: expiry,
      status:     computeStatus(expiry),
    });
    ok(res, updated);
  } catch (err) {
    error(res, err.message);
  }
}

async function remove(req, res, params) {
  try {
    const deleted = store.remove(COLLECTION, params.id);
    if (!deleted) return notFound(res, `Product ${params.id} not found`);
    ok(res, { id: params.id, deleted: true });
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { list, getOne, create, replace, patch, remove };
