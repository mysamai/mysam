const addClassification = require('../hooks/add-classification');
const addAction = require('../hooks/add-action');
const populate = require('../hooks/populate');
const clone = require('../hooks/clone');

module.exports = function () {
  const app = this;

  app.service('trainings').hooks({
    before: {
      all: clone(),
      create: addAction()
    },
    after: {
      all: populate('action', { service: 'actions' }),
      create: addClassification()
    }
  });
};
