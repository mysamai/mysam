const assert = require('assert');
const ls = require('node-localstorage');

const createApp = require('../lib');
const localStorage = new ls.LocalStorage('.');

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

  it('browser version', () => {
    global.window = { localStorage };

    const browser = require('../browser');
    const app = browser();

    assert.ok(app);

    delete global.window;
  });
});
