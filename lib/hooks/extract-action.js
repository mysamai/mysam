const debug = require('debug')('mysam-server/hooks/extract-action');
const { extractor } = require('../extract');

module.exports = function extractAction () {
  return function (hook) {
    const classification = hook.result;
    const reference = classification.action;
    const e = extractor(reference.text).tag(reference.tags || {});
    const { tags, extracted } = e.extract(classification.text);
    const action = Object.assign({}, reference, {
      tags, text: classification.text
    });

    debug('Extracted action', action);

    hook.result = Object.assign({}, classification, {
      action, extracted, reference
    });

    return hook;
  };
};
