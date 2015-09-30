import app from './app';

const config = require('../config.json');

app.listen(process.env.PORT || config.port);
