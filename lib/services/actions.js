const clone = require('../hooks/clone');

module.exports = function () {
  const app = this;

  app.service('actions').hooks({
    after: [ clone() ]
  });
};
