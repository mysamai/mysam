import pos from './pos';
import classify from './classify';
import nedb from 'feathers-nedb';

export default function() {
  const app = this;
  const actions = nedb('actions').extend({
    before: function(hook, next) {
      hook.data.input = hook.data.input.toLowerCase();
      next();
    }
  });

  return app.use('/actions', actions)
    .use('/pos', pos)
    .use('/classify', classify);
}
