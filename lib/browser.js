const createApp = require('./app');
const service = require('feathers-localstorage');

createApp(function () {
  const app = this;

  app.set('paginate', {
    default: 10,
    max: 50
  });

  app.defaultService = function (location) {
    const paginate = app.get('paginate');

    return service({
      paginate,
      startId: 1,
      id: '_id'
    });
  };
});
