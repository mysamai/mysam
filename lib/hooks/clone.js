const cloneDeep = require('lodash/cloneDeep');

module.exports = function () {
  return function (hook) {
    if (hook.data) {
      hook.data = cloneDeep(hook.data);
    }
  };
};
