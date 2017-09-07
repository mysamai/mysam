const memory = require('feathers-memory');
const initApp = require('./app');

module.exports = initApp(memory);
