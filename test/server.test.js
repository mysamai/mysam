const assert = require('assert');
const axios = require('axios');
const server = require('../src/server');

describe('server tests', () => {
  it('starts the server and hosts dist/ and current folder', async () => {
    const instance = server({
      path: __dirname,
      port: 7777
    });

    let res = await axios.get('http://localhost:7777');

    assert.ok(res.data.startsWith('<!DOCTYPE html>'));

    res = await axios.get('http://localhost:7777/app.js');

    assert.strictEqual(res.data, `console.log('Overwritten');\n`);

    return new Promise(resolve => instance.close(() => resolve()));
  });
});
