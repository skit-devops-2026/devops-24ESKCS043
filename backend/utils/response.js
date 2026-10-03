/**
 * response.js — Helpers to standardise HTTP JSON responses
 */

'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/** Send a successful JSON response */
function ok(res, data, statusCode = 200) {
  const body = JSON.stringify({ success: true, data });
  res.writeHead(statusCode, {
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(body),
    ...CORS_HEADERS,
  });
  res.end(body);
}

/** Send a created (201) JSON response */
function created(res, data) {
  ok(res, data, 201);
}

/** Send an error JSON response */
function error(res, message, statusCode = 500) {
  const body = JSON.stringify({ success: false, error: message });
  res.writeHead(statusCode, {
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(body),
    ...CORS_HEADERS,
  });
  res.end(body);
}

/** 404 shorthand */
function notFound(res, message = 'Not found') {
  error(res, message, 404);
}

/** 400 shorthand */
function badRequest(res, message = 'Bad request') {
  error(res, message, 400);
}

/** Send CORS preflight headers and end the request */
function preflight(res) {
  res.writeHead(204, CORS_HEADERS);
  res.end();
}

module.exports = { ok, created, error, notFound, badRequest, preflight, CORS_HEADERS };
