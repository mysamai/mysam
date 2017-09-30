const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const isProduction = process.env.NODE_ENV === 'production';
const filename = path.join('dist', isProduction ? 'mysam.min.js' : 'mysam.js');

let pipeline = browserify({
  entries: [ 'browser.js' ],
  standalone: 'mysam',
  debug: !isProduction
})
.transform('babelify', {
  global: true,
  only: /^(?:.*\/node_modules\/feathers.*\/|(?!.*\/node_modules\/)).*$/
});

if (isProduction) {
  pipeline = pipeline.transform('uglifyify', { global: true });
}

pipeline.bundle().pipe(fs.createWriteStream(filename));
