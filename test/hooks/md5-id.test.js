const assert = require('assert');
const md5 = require('blueimp-md5');
const md5Id = require('../../lib/hooks/md5-id');

describe('md5Id hook', function () {
  it('generates id', function () {
    const text = 'testing';
    const hook = {
      result: { text }
    };
    const fn = md5Id('id', 'text');

    assert.deepEqual(fn(hook).result, {
      id: md5('testing'), text
    });
  });
});
