const browserify = require('browserify');

browserify({
  entries: [ 'lib/browser.js' ],
  standalone: 'mysam',
  fullPaths: true
})
.transform('babelify', {
  global: true,
  only: /^(?:.*\/node_modules\/feathers.*\/|(?!.*\/node_modules\/)).*$/,
  presets: ['es2015']
})
.bundle()
.pipe(process.stdout);
