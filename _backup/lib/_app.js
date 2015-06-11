import feathers from 'feathers';
import mongodb from 'feathers-mongodb';
import path from 'path';
import config from './config';
import { classifiers, classification } from './services';

const app = feathers();

app.configure(config(app.settings.env))
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .use('/classifiers', classifiers)
  .use('/classification', classification)
  .use('/', feathers.static(path.join(__dirname, '..', app.get('frontend'))));

export default app;
