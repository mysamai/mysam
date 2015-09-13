import pos from 'pos';

const lexer = new pos.Lexer();
const tagger = new pos.Tagger();

export default {
  tokenize(text) {
    return lexer.lex(text);
  },

  create(data, params, callback) {
    let text = data.text;
    let tokens = this.tokenize(text);
    let tags = tagger.tag(tokens).map(function(touple) {
      return touple[1];
    });

    callback(null, { text, tokens, tags });
  }
};
