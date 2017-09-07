const localstorage = require('feathers-localstorage');
const initApp = require('./app');

module.exports = initApp(localstorage);
