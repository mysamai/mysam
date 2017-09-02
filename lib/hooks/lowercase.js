const debug = require('debug')('mysam-server/hooks/lowercase');

module.exports = function lowerCase (...fields) {
  return function (hook) {
    debug('Lowercasing', fields);

    for (let field of fields) {
      hook.data[field] = hook.data[field].toLowerCase();
    }

    return hook;
  };
};
