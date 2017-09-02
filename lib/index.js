const createApp = require('./app');
const service = require('feathers-memory');

module.exports = function (configurer = () => {}) {
  return createApp(function () {
    const app = this;

    app.defaultService = function (location) {
      const paginate = app.get('paginate');

      return service({
        paginate,
        startId: 1,
        id: '_id'
      });
    };

    app.configure(configurer);
  });
};
