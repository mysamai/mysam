require('babel/register');
require('./app').server.listen(process.env.PORT || 3030);