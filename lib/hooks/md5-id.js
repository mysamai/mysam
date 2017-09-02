const md5 = require('blueimp-md5');
const debug = require('debug')('mysam-server/hooks/md5-id');

module.exports = function md5Id (field = '_id', source = 'text') {
  return function (hook) {
    const data = hook.result || hook.data;

    if (data && data[source]) {
      debug('Setting MD5 id from', data[source]);
      data[field] = md5(data[source]);
    }

    return hook;
  };
};
