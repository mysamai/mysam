const core = require('mysam-core');
const ui = require('mysam-ui');
const { version } = require('../package.json');

module.exports = function (el) {
  // Initialize MySam core and its UI
  return ui(el, core());
};

Object.assign(module.exports, { core, ui, version });
