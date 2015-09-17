import bodyParser from 'body-parser';
import feathers from 'feathers';
import hooks from 'feathers-hooks';

import services from './services/index';
import plugins from './plugins';

const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(services)
  .configure(plugins);

export default app;
