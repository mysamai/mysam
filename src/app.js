import bodyParser from 'body-parser';
import feathers from 'feathers';
import hooks from 'feathers-hooks';
import frontend from 'mysam-frontend';

import services from './services/index';
import loader from './loader';


const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(services)
  .configure(frontend(feathers.static))
  .configure(loader);

export default app;
