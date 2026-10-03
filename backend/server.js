/**
 * server.js — Warranty Vault Node.js Backend (no framework)
 *
 * Uses only Node.js built-in modules: http, url, fs, path
 *
 * Start:  node backend/server.js
 *         PORT=4000 node backend/server.js
 */

'use strict';

const http = require('http');

const Router          = require('./router');
const products        = require('./controllers/products');
const categories      = require('./controllers/categories');
const users           = require('./controllers/users');
const serviceRecords  = require('./controllers/serviceRecords');
const documents       = require('./controllers/documents');
const { ok }          = require('./utils/response');

const PORT = process.env.PORT || 3001;

// ─── Router setup ────────────────────────────────────────────────────────────

const router = new Router();

// Health check
router.get('/api/health', (_req, res) => {
  ok(res, {
    status:    'ok',
    service:   'Warranty Vault API',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Products ──────────────────────────────────────────────────────────────────
router.get   ('/api/products',     products.list);
router.get   ('/api/products/:id', products.getOne);
router.post  ('/api/products',     products.create);
router.put   ('/api/products/:id', products.replace);
router.patch ('/api/products/:id', products.patch);
router.delete('/api/products/:id', products.remove);

// ── Categories ────────────────────────────────────────────────────────────────
router.get   ('/api/categories',     categories.list);
router.get   ('/api/categories/:id', categories.getOne);
router.post  ('/api/categories',     categories.create);
router.put   ('/api/categories/:id', categories.replace);
router.patch ('/api/categories/:id', categories.patch);
router.delete('/api/categories/:id', categories.remove);

// ── Users ─────────────────────────────────────────────────────────────────────
router.post  ('/api/users/login',  users.login);    // must come before :id route
router.get   ('/api/users',        users.list);
router.get   ('/api/users/:id',    users.getOne);
router.post  ('/api/users',        users.create);
router.put   ('/api/users/:id',    users.replace);
router.patch ('/api/users/:id',    users.patch);
router.delete('/api/users/:id',    users.remove);

// ── Service Records ───────────────────────────────────────────────────────────
router.get   ('/api/service-records',     serviceRecords.list);
router.get   ('/api/service-records/:id', serviceRecords.getOne);
router.post  ('/api/service-records',     serviceRecords.create);
router.put   ('/api/service-records/:id', serviceRecords.replace);
router.patch ('/api/service-records/:id', serviceRecords.patch);
router.delete('/api/service-records/:id', serviceRecords.remove);

// ── Documents ─────────────────────────────────────────────────────────────────
router.get   ('/api/documents',     documents.list);
router.get   ('/api/documents/:id', documents.getOne);
router.post  ('/api/documents',     documents.create);
router.patch ('/api/documents/:id', documents.patch);
router.delete('/api/documents/:id', documents.remove);

// ─── HTTP Server ──────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // Log every incoming request
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);

  router.handle(req, res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   Warranty Vault API — Node.js (no fw)  ║');
  console.log(`  ║   Listening on http://localhost:${PORT}    ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log('  Endpoints:');
  console.log('    GET  /api/health');
  console.log('    CRUD /api/products');
  console.log('    CRUD /api/categories');
  console.log('    CRUD /api/users');
  console.log('    POST /api/users/login');
  console.log('    CRUD /api/service-records');
  console.log('    CRUD /api/documents');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received — closing server...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('\nSIGINT received — closing server...');
  server.close(() => process.exit(0));
});

module.exports = server; // exported for tests
