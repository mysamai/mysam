const createApp = require('./app');
const service = require('feathers-memory');
const { defaultService } = require('./utils');

module.exports = function (configurer = () => {}) {
  return createApp(function () {
    const app = this;

    app.defaultService = defaultService(app, service);

    app.configure(configurer);
  });
};
