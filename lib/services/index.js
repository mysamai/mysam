const tokenize = require('./tokenize');
const classify = require('./classify');
const trainings = require('./trainings');
const actions = require('./actions');

module.exports = function () {
  const app = this;

  app.configure(trainings);
  app.configure(actions);
  app.configure(tokenize);
  app.configure(classify);
};
