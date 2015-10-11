import _ from 'lodash';
import path from 'path';
import bodyParser from 'body-parser';
import feathers from 'feathers';
import hooks from 'feathers-hooks';
import frontend from 'mysam-frontend';

import services from './services/index';
import loader from './loader';
import sam from './sam';

const app = feathers();

_.extend(app, sam);

app.configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(services())
  .configure(frontend(feathers.static))
  // Hack for development mode frontend shared dependencies
  // installed by NPM in the top level
  .use('/node_modules', feathers.static(path.join(__dirname, '..', 'node_modules')))
  .configure(loader(true));

export default app;
