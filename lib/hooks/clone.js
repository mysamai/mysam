const cloneDeep = require('lodash/cloneDeep');

module.exports = function () {
  return function (hook) {
    hook.result = cloneDeep(hook.result);
  };
};
