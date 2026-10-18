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

// Prometheus metrics
const metrics = {
  totalRequests: 0,
  requestsByMethod: {},
  requestsByStatus: {},
};

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
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);

  // Expose Prometheus metrics
  if (req.method === 'GET' && req.url === '/metrics') {
    const body = [
      '# HELP warranty_vault_http_requests_total Total HTTP requests received',
      '# TYPE warranty_vault_http_requests_total counter',
      `warranty_vault_http_requests_total ${metrics.totalRequests}`,
      '# HELP warranty_vault_http_requests_by_method_total HTTP requests by method',
      '# TYPE warranty_vault_http_requests_by_method_total counter',
      ...Object.entries(metrics.requestsByMethod).map(
        ([method, count]) =>
          `warranty_vault_http_requests_by_method_total{method="${method}"} ${count}`
      ),
      '',
    ].join('\n');

    res.writeHead(200, {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
    });
    res.end(body);
    return;
  }

  metrics.totalRequests++;
  metrics.requestsByMethod[req.method] =
    (metrics.requestsByMethod[req.method] || 0) + 1;

  res.once('finish', () => {
    const status = String(res.statusCode);
    metrics.requestsByStatus[status] =
      (metrics.requestsByStatus[status] || 0) + 1;
  });

  router.handle(req, res);
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

module.exports = server; // exported for tests
