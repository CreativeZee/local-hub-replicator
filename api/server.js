// api/server.js
const serverless = require('serverless-http');
const app = require('../backend/app'); // path to your backend Express app

module.exports = serverless(app);
