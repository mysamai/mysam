import _ from 'lodash';
import { resolve } from 'path';
import config from '../config/config.json';

module.exports = function (env) {
  return function() {
    let app = this;

    console.info(`Initializing configuration for ${env} environment`);

    // Dev is our default development. For everything else extend the default
    if(env !== 'development') {
      _.extend(config, require(`../config/${env}.json`));
    }

    _.each(config, (value, name) => {
      if(process.env[value]) {
        value = process.env[value];
      }

      // Make relative paths absolute
      if(typeof value === 'string' &&  (value.indexOf('./') === 0 || value.indexOf('../') === 0)) {
        value = resolve(__dirname, '..', value);
      }

      app.set(name, value);
    });

    if(!/auto_reconnect/.test(app.get('mongodb'))) {
      app.set('mongodb', app.get('mongodb') + '?auto_reconnect=true');
      console.info('Updating MongoDB connection string with auto_reconnect');
    }
  };
};
