const localstorage = require('feathers-localstorage');
const initApp = require('./lib/app');

module.exports = initApp(localstorage);
