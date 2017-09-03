const Extractor = require('./extractor');
const stem = require('./utils');
const { tokenize } = stem;

module.exports = {
  tokenize,
  stem,
  Extractor,
  extractor (sentence) {
    return new Extractor(sentence);
  }
};
