const test = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = 'test-secret';

delete require.cache[require.resolve('../app.js')];

test('serverless entry exports Express app without binding a port', { timeout: 1000 }, () => {
  const { app, startServer } = require('../app.js');
  assert.equal(typeof app.use, 'function');
  assert.equal(typeof app.handle, 'function');
  assert.equal(typeof startServer, 'function');
});

test('URL validation rejects unsafe or malformed URLs', () => {
  const { isValidUrl } = require('../utils/validation');

  assert.equal(isValidUrl('https://example.com'), true);
  assert.equal(isValidUrl('not-a-url'), false);
  assert.equal(isValidUrl('ftp://example.com'), false);
  assert.equal(isValidUrl(''), false);
});

test('password hashing stores a secure hash and verifies correctly', async () => {
  const { hashPassword, comparePassword } = require('../service/auth');

  const password = 'StrongPassword123!';
  const hash = await hashPassword(password);

  assert.notEqual(hash, password);
  assert.equal(await comparePassword(password, hash), true);
  assert.equal(await comparePassword('wrong-password', hash), false);
});
