import Q from 'q';
import path from 'path';
import npm from 'npm';
import _ from 'lodash';
import debug from 'debug';
import feathers from 'feathers';

const log = debug('mysam:plugins');

export default function() {
  const app = this;
  const plugins = app.service('plugins');

  Q.ninvoke(npm, 'load', { loaded: false, depth: 0 })
    .then(() => {
      const dfd = Q.defer();

      npm.commands.ls([], true, function (error, data) {
        if(error) {
          return dfd.reject(error);
        }

        let configurers = _.map(data.dependencies, (dependency, name) => {
          let config = dependency.mysam;
          if(config) {
            let pluginLoader = require(name);

            log(`Found plugin dependency ${dependency.name}`);

            if(typeof pluginLoader !== 'function') {
              throw new Error(`Can not configure plugin ${dependency.name}`);
            } else {
              if(config.public) {
                let publicPath = feathers.static(path.join(dependency.path, config.public));
                log(`Configuring ${dependency.name} at path ${publicPath}`);
                app.use(`/${dependency.name}`, publicPath);
              }

              return Q.ninvoke(plugins, 'create', dependency)
                .then(() => app.configure(pluginLoader));
            }
          }
        });

        dfd.resolve(Q.all(configurers));
      });

      return dfd.promise;
    }).fail(error => console.error(error.stack));
}
