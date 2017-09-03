const feathers = require('feathers');
const services = require('./services/index');

module.exports = function (configurer) {
  const app = feathers();

  app.set('paginate', {
    default: 10,
    max: 50
  });

  app.configure(configurer);
  app.configure(services);

  return app;
};
