const path = require('node:path');
module.exports = {
  name: 'fastify',
  type: 'http',
  http: {
    server: path.join(__dirname, './fastify-server.js'),
    serverPort: 3000,
    routes: [
      { path: '/', method: 'GET' },
      { path: '/schema', method: 'GET' },
    ],
  },
  benchmarker: 'autocannon',
};
