const feathers = require('feathers');
const services = require('./services/index');

module.exports = function (service) {
  return function (configurer = () => {}) {
    const app = feathers();

    app.set('paginate', {
      default: 10,
      max: 50
    });

    app.defaultService = function (location) {
      const paginate = app.get('paginate');

      return service({
        paginate,
        name: `mysam-${location}`,
        startId: 1,
        id: '_id'
      });
    };

    app.configure(configurer);
    app.configure(services);

    return app;
  };
};
