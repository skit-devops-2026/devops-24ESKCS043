'use strict';
require('path'); require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const app = require('./app'); // Express app
const http = require('http');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('\\nSIGTERM received — closing server...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('\\nSIGINT received — closing server...');
  server.close(() => process.exit(0));
});

module.exports = server;
