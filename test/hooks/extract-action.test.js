const assert = require('assert');
const extractAction = require('../../lib/hooks/extract-action');

describe('extractAction hook', function () {
  it('extractAction', function () {
    const action = {
      type: 'weather',
      meta: { some: 'metadata' },
      text: 'what\'s the weather in vancouver',
      tags: {
        location: [ 5, 5 ]
      }
    };
    const hook = {
      result: {
        _id: 'test',
        text: 'do you know weather in san francisco',
        action
      }
    };
    const fn = extractAction();

    assert.deepEqual(fn(hook).result, {
      _id: 'test',
      text: 'do you know weather in san francisco',
      action: {
        type: 'weather',
        meta: { some: 'metadata' },
        text: 'do you know weather in san francisco',
        tags: {
          location: [ 5, 6 ]
        }
      },
      reference: action,
      extracted: {
        location: 'san francisco'
      }
    });
  });
});
