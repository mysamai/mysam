const assert = require('assert');
const createApp = require('../lib');

describe('mysam-core app', () => {
  it('creates default services', () => {
    const app = createApp();
    const service = app.service('people');

    assert.ok(service);

    return service.create({ name: 'David' }).then(person => {
      assert.ok(person._id !== undefined);

      return service.find().then(page => {
        assert.equal(page.total, 1);
        assert.equal(page.data.length, 1);
      });
    });
  });
});
