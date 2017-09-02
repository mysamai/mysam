const assert = require('assert');
const lowerCase = require('../../lib/hooks/lowercase');

describe('lowerCase hook', function () {
  it('lowercases', function () {
    const hook = {
      data: {
        text: 'HELLO',
        other: 'HERE'
      }
    };
    const fn = lowerCase('text', 'other');

    assert.deepEqual(fn(hook).data, {
      text: 'hello',
      other: 'here'
    });
  });
});
