const assert = require('assert');
const md5 = require('blueimp-md5');
const createApp = require('../../lib');

describe('tokenize service', () => {
  it('tokenizes and stems', () => {
    const app = createApp();
    const text = `what's the weather in vancouver`;
    const hash = md5(text);

    return app.service('tokenize').create({ text }).then(data => {
      assert.equal(data._id, hash, 'id is MD5 hash of the string');
      assert.deepEqual(data, {
        _id: '873dd3d48eed1d576a4d5b1dcacd2348',
        text: 'what\'s the weather in vancouver',
        tokens: [ 'what', 's', 'the', 'weather', 'in', 'vancouver' ],
        stems: [ 'what', 's', 'the', 'weather', 'in', 'vancouv' ]
      });
    });
  });
});
