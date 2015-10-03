import bodyParser from 'body-parser';
import feathers from 'feathers';
import hooks from 'feathers-hooks';
import path from 'path';

import config from '../config.json';
import services from './services/index';
import loader from './loader';

const publicPath = path.join(__dirname, '..', 'node_modules', config.frontend);
const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/', function(req, res,  next) {
    if(req.url === '/' && process.env.NODE_ENV === 'production') {
      return res.sendFile(path.join(publicPath, 'production.html'));
    }

    next();
  })
  .use('/', feathers.static(publicPath))
  .configure(services)
  .configure(loader);

export default app;
