const memory = require('feathers-memory');
const localstorage = require('feathers-localstorage');
const initApp = require('./app');

const createService = options => {
  const hasLocalStorage = typeof window !== 'undefined' && window.localStorage;
  const service = hasLocalStorage ? localstorage : memory;

  return service(options);
};

module.exports = initApp(createService);
module.exports.init = initApp;
