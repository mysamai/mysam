const service = require('feathers-memory');

const tokenize = require('./tokenize');
const classify = require('./classify');
const trainings = require('./trainings');
const actions = require('./actions');

module.exports = function () {
  const app = this;

  app.defaultService = function (location) {
    const paginate = app.get('paginate');

    return service({
      paginate,
      startId: 1,
      id: '_id'
    });
  };

  app.configure(trainings)
    .configure(actions)
    .configure(tokenize)
    .configure(classify);
};
