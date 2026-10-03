/**
 * router.js — Zero-dependency HTTP request router
 *
 * Supports:
 *   - Static routes:   GET /api/health
 *   - Named params:    GET /api/products/:id
 *   - Query strings:   GET /api/products?userId=usr-1
 *
 * Usage:
 *   const router = new Router();
 *   router.get('/api/products',    handler);
 *   router.get('/api/products/:id', handler);
 *   router.post('/api/products',   handler);
 *   ...
 *   router.handle(req, res);   // call inside http.createServer callback
 */

'use strict';

// Using WHATWG URL API (no imports needed — global in Node 10+)
const { preflight, notFound } = require('./utils/response');

class Router {
  constructor() {
    // routes: Array<{ method, pattern, keys, handler }>
    this._routes = [];
  }

  /**
   * Register a route.
   * @param {string} method  HTTP verb (uppercase)
   * @param {string} path    Route path, e.g. '/api/products/:id'
   * @param {Function} handler  async (req, res, params, query) => void
   */
  _add(method, path, handler) {
    const keys    = [];
    // Convert ':param' segments into named capture groups
    // Escape regex special chars except ':' and '/', then convert :param → capture groups
    const regexStr = path
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')   // escape regex special chars
      .replace(/:([a-zA-Z0-9_]+)/g, (_match, key) => {
        keys.push(key);
        return '([^/]+)';
      });
    const pattern = new RegExp(`^${regexStr}$`);
    this._routes.push({ method, pattern, keys, handler });
  }

  get(path, handler)    { this._add('GET',    path, handler); }
  post(path, handler)   { this._add('POST',   path, handler); }
  put(path, handler)    { this._add('PUT',    path, handler); }
  patch(path, handler)  { this._add('PATCH',  path, handler); }
  delete(path, handler) { this._add('DELETE', path, handler); }

  /**
   * Main dispatch method — call this inside http.createServer.
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse}  res
   */
  async handle(req, res) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      return preflight(res);
    }

    const parsed   = new URL(req.url, 'http://localhost');
    const pathname = parsed.pathname;
    const query    = Object.fromEntries(parsed.searchParams.entries());
    const method   = req.method.toUpperCase();

    for (const route of this._routes) {
      if (route.method !== method) continue;
      const match = pathname.match(route.pattern);
      if (!match) continue;

      // Build params object from named capture groups
      const params = {};
      route.keys.forEach((key, i) => { params[key] = decodeURIComponent(match[i + 1]); });

      try {
        await route.handler(req, res, params, query);
      } catch (err) {
        const { error } = require('./utils/response');
        error(res, `Internal server error: ${err.message}`, 500);
      }
      return;
    }

    notFound(res, `Cannot ${method} ${pathname}`);
  }
}

module.exports = Router;
