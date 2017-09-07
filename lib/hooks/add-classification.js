const md5 = require('blueimp-md5');
const debug = require('debug')('mysam-server/hooks/add-classification');

const { extractor } = require('../extract');

module.exports = function addClassification () {
  return function (hook) {
    const training = hook.result;
    const { text, action } = training;
    const e = extractor(text).tag(action.tags || {});
    const { extracted } = e.extract(text);
    const classification = {
      _id: md5(text),
      confidence: 1,
      reference: action,
      action,
      extracted
    };

    return hook.app.service('tokenize').create({ text })
      .then(tokenized => Object.assign(classification, tokenized))
      .then(classification => {
        debug('Adding classification', classification);

        hook.result = Object.assign({ classification }, hook.result);

        return hook;
      });
  };
};
