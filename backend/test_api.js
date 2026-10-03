/**
 * test_api.js — Lightweight smoke-test for the Warranty Vault API
 * Uses only built-in Node.js `http` module — no test framework needed.
 *
 * Run:  node backend/test_api.js
 *
 * The script starts the server on port 3099 (won't conflict with prod),
 * runs a set of HTTP assertions, then exits with code 0 (pass) or 1 (fail).
 */

'use strict';

process.env.PORT = '3099';

const http   = require('http');
const server = require('./server');   // starts listening on 3099

const BASE = 'http://localhost:3099';

let passed = 0;
let failed = 0;

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port:     3099,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Assertion helpers ────────────────────────────────────────────────────────

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🧪  Warranty Vault API Smoke Tests\n');

  // ── Health ──────────────────────────────────────────────────────────────────
  console.log('── /api/health ──────────────────────────────');
  const health = await request('GET', '/api/health');
  assert('GET /api/health returns 200',        health.status === 200);
  assert('health.data.status === "ok"',        health.body?.data?.status === 'ok');

  // ── Products ────────────────────────────────────────────────────────────────
  console.log('\n── /api/products ────────────────────────────');
  const listP = await request('GET', '/api/products');
  assert('GET /api/products returns 200',      listP.status === 200);
  assert('returns an array',                   Array.isArray(listP.body?.data));

  const newProd = await request('POST', '/api/products', {
    name: 'Test Widget', brand: 'ACME', category: 'Gadgets',
    purchaseDate: '2025-01-01', warrantyMonths: 12, userId: 'usr-1',
  });
  assert('POST /api/products returns 201',     newProd.status === 201);
  assert('new product has an id',              !!newProd.body?.data?.id);
  const prodId = newProd.body?.data?.id;

  const getP = await request('GET', `/api/products/${prodId}`);
  assert('GET /api/products/:id returns 200',  getP.status === 200);
  assert('returns correct product',            getP.body?.data?.id === prodId);

  const patchP = await request('PATCH', `/api/products/${prodId}`, { notes: 'patched' });
  assert('PATCH /api/products/:id returns 200', patchP.status === 200);
  assert('notes field updated',                patchP.body?.data?.notes === 'patched');

  const delP = await request('DELETE', `/api/products/${prodId}`);
  assert('DELETE /api/products/:id returns 200', delP.status === 200);
  assert('deleted flag true',                  delP.body?.data?.deleted === true);

  const gone = await request('GET', `/api/products/${prodId}`);
  assert('GET deleted product returns 404',    gone.status === 404);

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log('\n── /api/categories ──────────────────────────');
  const listC = await request('GET', '/api/categories');
  assert('GET /api/categories returns 200',    listC.status === 200);
  assert('categories is an array',             Array.isArray(listC.body?.data));

  // ── Users / Login ───────────────────────────────────────────────────────────
  console.log('\n── /api/users ───────────────────────────────');
  const listU = await request('GET', '/api/users');
  assert('GET /api/users returns 200',         listU.status === 200);

  const badLogin = await request('POST', '/api/users/login', { email: 'x@x.com', password: 'wrong' });
  assert('invalid login returns 401',          badLogin.status === 401);

  // ── Service Records ─────────────────────────────────────────────────────────
  console.log('\n── /api/service-records ─────────────────────');
  const listS = await request('GET', '/api/service-records');
  assert('GET /api/service-records returns 200', listS.status === 200);

  const newSrv = await request('POST', '/api/service-records', {
    productId: 'prod-1', center: 'Test Center', issue: 'Smoke test issue',
  });
  assert('POST /api/service-records returns 201', newSrv.status === 201);
  const srvId = newSrv.body?.data?.id;

  const delS = await request('DELETE', `/api/service-records/${srvId}`);
  assert('DELETE /api/service-records/:id',    delS.status === 200);

  // ── Documents ───────────────────────────────────────────────────────────────
  console.log('\n── /api/documents ───────────────────────────');
  const listD = await request('GET', '/api/documents');
  assert('GET /api/documents returns 200',     listD.status === 200);

  const newDoc = await request('POST', '/api/documents', {
    productId: 'prod-1', name: 'test.pdf', type: 'Receipt',
  });
  assert('POST /api/documents returns 201',    newDoc.status === 201);
  const docId = newDoc.body?.data?.id;

  const delD = await request('DELETE', `/api/documents/${docId}`);
  assert('DELETE /api/documents/:id',          delD.status === 200);

  // ── 404 ─────────────────────────────────────────────────────────────────────
  console.log('\n── 404 ──────────────────────────────────────');
  const miss = await request('GET', '/api/no-such-route');
  assert('Unknown route returns 404',          miss.status === 404);

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log(`\n────────────────────────────────────────────`);
  console.log(`  ${passed} passed · ${failed} failed`);
  console.log(`────────────────────────────────────────────\n`);

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

// Give the server a moment to start listening before firing tests
setTimeout(run, 200);
