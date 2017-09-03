const createApp = require('./app');
const service = require('feathers-localstorage');
const { defaultService } = require('./utils');

module.exports = createApp(function () {
  const app = this;

  app.defaultService = defaultService(app, service);
});
