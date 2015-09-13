import path from 'path';
import bodyParser from 'body-parser';
import feathers from 'feathers';
import hooks from 'feathers-hooks';

import services from './services/index';

const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(services)
  .use('/', feathers.static(path.join(__dirname, '..', 'public')));

export default app;
