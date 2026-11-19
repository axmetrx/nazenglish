const serverless = require('serverless-http');
const app = require('../../frontend/api/index.js');

module.exports.handler = serverless(app);
