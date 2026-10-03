/**
 * users.js — User management controller for /api/users
 *
 * NOTE: Passwords are NOT hashed here (no dependencies allowed).
 *       Production should integrate bcrypt or native crypto.
 *
 * GET    /api/users              → list all (Admin only — no auth middleware yet)
 * GET    /api/users/:id          → get one user
 * POST   /api/users              → register new user
 * PUT    /api/users/:id          → full replace
 * PATCH  /api/users/:id          → partial update (e.g., change role/status)
 * DELETE /api/users/:id          → delete user
 * POST   /api/users/login        → simple credential check (returns user object)
 */

'use strict';

const store      = require('../utils/fileStore');
const { ok, created, notFound, badRequest, error } = require('../utils/response');
const { parseBody }  = require('../utils/parseBody');
const { generateId } = require('../utils/idGen');

const COLLECTION = 'users';

/** Omit the passwordHash field from API responses */
function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

async function list(_req, res) {
  try {
    ok(res, store.getCollection(COLLECTION).map(sanitize));
  } catch (err) {
    error(res, err.message);
  }
}

async function getOne(_req, res, params) {
  try {
    const user = store.findById(COLLECTION, params.id);
    if (!user) return notFound(res, `User ${params.id} not found`);
    ok(res, sanitize(user));
  } catch (err) {
    error(res, err.message);
  }
}

async function create(req, res) {
  try {
    const body = await parseBody(req);
    if (!body.name)     return badRequest(res, 'Missing required field: name');
    if (!body.email)    return badRequest(res, 'Missing required field: email');
    if (!body.password) return badRequest(res, 'Missing required field: password');

    // Check duplicate email
    const existing = store.getCollection(COLLECTION).find(u => u.email === body.email);
    if (existing)       return badRequest(res, 'Email already registered');

    const user = {
      id:           generateId('usr'),
      name:         body.name,
      email:        body.email,
      // ⚠️ Plain-text store — replace with crypto.scrypt in production
      passwordHash: body.password,
      role:         body.role   || 'User',
      plan:         body.plan   || 'Free Plan',
      status:       'Active',
      joinedDate:   new Date().toISOString(),
    };
    store.insert(COLLECTION, user);
    created(res, sanitize(user));
  } catch (err) {
    error(res, err.message);
  }
}

async function replace(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `User ${params.id} not found`);

    const body = await parseBody(req);
    if (!body.name || !body.email) return badRequest(res, 'name and email are required');

    const updated = store.update(COLLECTION, params.id, {
      name:  body.name,
      email: body.email,
      role:  body.role  || existing.role,
      plan:  body.plan  || existing.plan,
      status:body.status|| existing.status,
    });
    ok(res, sanitize(updated));
  } catch (err) {
    error(res, err.message);
  }
}

async function patch(req, res, params) {
  try {
    const existing = store.findById(COLLECTION, params.id);
    if (!existing) return notFound(res, `User ${params.id} not found`);

    const body    = await parseBody(req);
    const updated = store.update(COLLECTION, params.id, body);
    ok(res, sanitize(updated));
  } catch (err) {
    error(res, err.message);
  }
}

async function remove(_req, res, params) {
  try {
    const deleted = store.remove(COLLECTION, params.id);
    if (!deleted) return notFound(res, `User ${params.id} not found`);
    ok(res, { id: params.id, deleted: true });
  } catch (err) {
    error(res, err.message);
  }
}

/** POST /api/users/login — simple credential verification */
async function login(req, res) {
  try {
    const { email, password } = await parseBody(req);
    if (!email || !password) return badRequest(res, 'email and password are required');

    const user = store.getCollection(COLLECTION).find(u => u.email === email);
    if (!user || user.passwordHash !== password) {
      return error(res, 'Invalid email or password', 401);
    }
    if (user.status !== 'Active') {
      return error(res, 'Account is suspended', 403);
    }

    ok(res, { user: sanitize(user), token: `mock-token-${user.id}` });
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { list, getOne, create, replace, patch, remove, login };
