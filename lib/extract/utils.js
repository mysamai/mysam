const { WordTokenizer } = require('natural/lib/natural/tokenizers/regexp_tokenizer');
const PorterStemmer = require('natural/lib/natural/stemmers/porter_stemmer');
const tokenizer = new WordTokenizer();

function tokenize (text) {
  return Array.isArray(text) ? text : tokenizer.tokenize(text);
}

const stem = module.exports = function stem (words, stemmer = PorterStemmer) {
  const tokens = typeof words === 'string' ? tokenize(words) : words;

  return tokens.map(word => stemmer.stem(word));
};

stem.tokenize = tokenize;
