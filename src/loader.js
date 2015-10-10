import Q from 'q';
import path from 'path';
import { exec } from 'child_process';
import debug from 'debug';
import feathers from 'feathers';

const log = debug('mysam:plugins');

export default function(global) {
  return function() {
    const app = this;
    const plugins = app.service('plugins');
    const loadPlugin = moduleName => {
      try {
        let pkgPath = require.resolve(path.join(moduleName, 'package.json'));

        let pkg = require(pkgPath);
        let config = pkg.mysam;

        if(!config) {
          throw new Error(`${moduleName} is not a Mysam plugin.`);
        }

        log(`Found plugin ${pkg.name}`);

        let dirname = path.dirname(pkgPath);
        let staticPath = path.join(dirname, config.public || '.');

        log(`Setting up ${staticPath} at /${pkg.name}`);

        app.use(`/${pkg.name}`, feathers.static(staticPath));

        return Q.ninvoke(plugins, 'create', pkg)
          .then(() => {
            let pluginLoader = require(moduleName);
            pluginLoader(app);
          });
      } catch(e) {
        log(`Not loading plugin module ${moduleName}`);
        return Q(null);
      }
    };

    return Q.nfcall(exec, `npm ls --depth 0 --parseable ${global ? '-g' : ''}`)
      .then(stdout => {
        let modules = stdout.toString().trim().split('\n');

        return Q.all(modules.map(path => loadPlugin(path)));
      }).fail(error => console.error(error.stack));
  };
}
