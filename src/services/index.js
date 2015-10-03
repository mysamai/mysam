import classify from './classify';
import nedb from 'feathers-nedb';
import plugins from './plugins';

export default function() {
  const app = this;

  return app.use('/actions', nedb('actions'))
    .use('/configurations', nedb('configuration'))
    .use('/plugins', plugins)
    .use('/classify', classify);
}
