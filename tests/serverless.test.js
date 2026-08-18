const test = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'production';

delete require.cache[require.resolve('../index.js')];

test('serverless entry exports Express app without binding a port', { timeout: 1000 }, () => {
  const app = require('../index.js');
  assert.equal(typeof app.use, 'function');
  assert.equal(typeof app.handle, 'function');
});
