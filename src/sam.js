import { join } from 'path';
import nedb from 'feathers-nedb';

const path = join(__dirname, '..', 'db-data');

export default {
  action(type, callback) {
    this.service('classify').after({
      create(hook, next) {
        let result = hook.result;
        if(result.action && result.action.type === type) {
          return callback(result, next);
        }

        next();
      }
    });
  },

  database(name) {
    return nedb({ name, path });
  }
};
