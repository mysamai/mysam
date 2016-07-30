import classify from './classify';
import plugins from './plugins';

export default function() {
  return function() {
    const app = this;

    app.use('/actions', app.database('actions'))
      .use('/configurations', app.database('configuration'))
      .use('/plugins', plugins())
      .use('/classify', classify());
  };
}
