var path = require('path');
var express = require('express');

module.exports = options => {
  const { port } = options;
  var app = express();

  app.use(express.static(options.path));
  app.use(express.static(path.join(__dirname, '..', 'dist')));

  return app.listen(port);
};
