require('babel/register');

var feathers = require('feathers');
var app = feathers().use('/', function(req, res) {
  res.end('Working!')
});

app.listen(8080);

require('./lib/frontend/index');