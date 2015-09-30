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
  const loadPlugin = moduleName => {
    if(!moduleName){
      return Q(null);
    }

    let pkgPath = require.resolve(path.join(moduleName, 'package.json'));
    let pkg = require(pkgPath);
    let config = pkg.mysam;

    if(!config) {
      return Q(null);
    }

    log(`Found plugin ${pkg.name}`);

    let pluginLoader = require(moduleName);

    if(typeof pluginLoader !== 'function') {
      throw new Error(`Can not configure plugin ${pkg.name}`);
    } else {
    }
    if(config.public) {
      let dirname = path.dirname(pkgPath);
      let staticPath = path.join(dirname, config.public);

      log(`Setting up ${staticPath} at /${pkg.name}`);

      app.use(`/${pkg.name}`, feathers.static(staticPath));
    }

    return Q.ninvoke(plugins, 'create', pkg)
      .then(() => {
        try {
          let pluginLoader = require(moduleName);
          app.configure(pluginLoader);
        } catch(e) {
          log(`No server configuration module for ${pkg.name}.`);
        }
      });
  };

  Q.ninvoke(npm, 'load', { loaded: false, global: true, depth: 0 })
    .then(() => {
      const dfd = Q.defer();

      npm.commands.ls([], true, function (error, data) {
        if(error) {
          return dfd.reject(error);
        }

        let configurers = [];

        _.each(data.dependencies, dependency =>
          dependency && configurers.push(loadPlugin(dependency.path)));

        dfd.resolve(Q.all(configurers));
      });

      return dfd.promise;
    }).fail(error => console.error(error.stack));
}
