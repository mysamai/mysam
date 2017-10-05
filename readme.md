# Say *hi*, SAM

[![Greenkeeper badge](https://badges.greenkeeper.io/mysamai/mysam.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/mysamai/mysam.png?branch=master)](https://travis-ci.org/mysamai/mysam)
[![Code Climate](https://codeclimate.com/github/mysamai/mysam/badges/gpa.svg)](https://codeclimate.com/github/mysamai/mysam)
[![Test Coverage](https://codeclimate.com/github/mysamai/mysam/badges/coverage.svg)](https://codeclimate.com/github/mysamai/mysam/coverage)
[![Dependency Status](https://img.shields.io/david/mysamai/mysam.svg?style=flat-square)](https://david-dm.org/mysamai/mysam)
[![Download Status](https://img.shields.io/npm/dm/mysam.svg?style=flat-square)](https://www.npmjs.com/package/mysam)

> Sam is an open-source, web-based *"intelligent"* assistant. It can listen to you, learn new actions and is extensible with JavaScript plugins running in any modern browser.

Watch this video to see what Sam can do:

[![MySam video](http://mysamai.github.io/mysam/mysam-video.png)](https://www.youtube.com/watch?v=VxFtSsCM_bo)

## Getting started

```
mkdir mysam-test
cd mysam-test
```

Create the following `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>MySam</title>
  <link href="https://fonts.googleapis.com/css?family=Muli:400,400italic" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://unpkg.com/mysam-ui@0.0.2/dist/styles.css">
</head>
<body>
  <div id="content" class="full"></div>
  <script src="https://unpkg.com/mysam@0.2.0-pre.1/dist/mysam.js"></script>
  <script src="https://unpkg.com/mysam-ui@0.0.2/dist/mysam-ui.js"></script>
  <script>
    // Initialize API (in the browser)
    const app = mysam();
    // Load the UI
    const sam = mysamUi(document.getElementById('content'), app);
  </script>
</body>
</html>
```

Then serve serve the folder from a webserver, e.g. with

```
npm i -g node-static
static
```

And visit it in a browser (here [localhost:8080](http://localhost:8080)).

## Writing a plugin

In the `<script>` section above add

```js
// Add a new plugin to the list of learnable actions
sam.learn('myplugin', {
  description: 'Say hello from my plugin'
});

// Register the action to perform when a classificationc comes in
sam.action('myplugin', (el, classification = {}) => {
  // `el` is the main HTML element to render in
  // classification has information about what was said
  el.innerHTML = 'Hello from myplugin! You said: '
    + classification.text;
});
```

## Usage with Webpack

```
mkdir mysam-test
cd mysam-test
npm init --yes
```

Add the following `webpack.config.json`:

```js
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const commons = {
  context: path.join(__dirname, 'src'),
  entry: './index.js',
  output: {
    filename: path.join('dist', 'app.js')
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules\/(?!(feathers|mysam|mysam-ui))/,
      loader: 'babel-loader'
    }]
  },
  node: {
    fs: 'empty'
  }
};

const dev = {
  devtool: 'source-map',
  devServer: {
    port: 3030,
    contentBase: '.',
    compress: true
  }
};

const production = {
  devtool: 'cheap-module-source-map',
  output: {
    filename: path.join('dist', 'nina.js')
  },
  plugins: [
    new UglifyJSPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      },
      comments: false,
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

module.exports = merge(commons, env !== 'development' ? production : dev);
```

Install devDependencies

```
npm install babel-core babel-loader babel-polyfill babel-preset-es2015 babel-preset-react uglify-js uglifyjs-webpack-plugin webpack webpack-dev-server webpack-merge --save-dev
```

And main dependencies

```
npm install mysam@pre mysam-ui react react-dom --save
```

Add a start script to `package.json`:

```
"start": "webpack-dev-server",
```

And run `npm start`.

## Coming soon!

Website and more in-depth documentation coming soon!
