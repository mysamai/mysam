const debug = require('debug')('mysam-server/hooks/add-tokenization');

module.exports = function addTokenization () {
  return function (hook) {
    const text = hook.result.text || hook.result.action.text;

    return hook.app.service('tokenize').create({ text })
      .then(tokenized => {
        debug('Adding tokenization', tokenized);

        hook.result = Object.assign({}, tokenized, hook.result);
        return hook;
      });
  };
};
