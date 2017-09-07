const md5Id = require('../../hooks/md5-id');
const clone = require('../../hooks/clone');
const Tokenizer = require('./tokenize.class');

module.exports = function () {
  const app = this;

  app.use('/tokenize', new Tokenizer());
  app.service('tokenize').hooks({
    after: [
      clone(),
      md5Id()
    ]
  });
};
