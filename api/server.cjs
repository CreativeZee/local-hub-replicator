// server.cjs
const serverless = require('serverless-http');
const app = require('./backend/app.cjs'); // updated

module.exports = serverless(app);
