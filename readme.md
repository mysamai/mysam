# Say *hi*, SAM

[![Codeship Status for daffl/mysam](https://codeship.com/projects/b26a3f10-3c66-0133-d19d-1276d5d0a1e7/status?branch=master)](https://codeship.com/projects/102258)

> Sam is an open-source, web-based *"intelligent"* assistant. It can listen to you, learn new actions and is extensible with JavaScript plugins. Sam runs a [NodeJS](https://nodejs.org/en/) server and in any modern browser or as an [Electron](http://electron.atom.io/) desktop application.

Watch this video to see what Sam can do:

[![MySam video](http://daffl.github.io/mysam/mysam-video.png)](https://www.youtube.com/watch?v=VxFtSsCM_bo)

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Using the CLI](#using-the-cli)
- [Plugins](#plugins)
  - [Creating Plugins](#creating-plugins)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install Sam globally with:

`$ npm install mysam -g`

And then run either the desktop application with:

`$ mysam`

Or the server only (which will be available at [localhost:9090](http://localhost:9090)) via:

`$ mysam --server`

## Getting Started

At first startup Sam will load the basic frontend training data (like learning your name, provide help, saying hi or to learn something new) and ask for your name.

To talk to Sam press *CTRL + SPACE* (make sure the window is focused).

All inputs can be submitted with *CTRL + ENTER* (when not in a textarea).

## Using the CLI

The following command line options are available:

|       Flags       |        Description        |
|-------------------|---------------------------|
| `-s`, `--server`  | Start server mode only    |
| `-d`, `--develop` | Start in development mode |

Development mode (`--develop`) will load the development tools in the Electron application, output detailed log messages to the command line and load the frontend in individual modules. This is helpful when creating your own plugins.

## Plugins

All plugins are available on NPM. To ask Sam about the weather run:

`$ npm install mysam-weather -g`

Then restart the application and ask something like

> What's the weather in Berlin?

### Creating Plugins

To create a new plugin create a new folder with the following `package.json`:

```
{
  "name": "mysam-myplugin",
  "main": "server",
  "mysam": {
    "client": "frontend",
    "styles": "styles.css"
  },
  "keywords": [
    "mysam-plugin"
  ]
}
```
> **Note**: It is important to add the `mysam-plugin` keyword to your `package.json`
file to ensure that your plugin will be shown in *MySam*'s plugins catalog.

- In the same folder a `server.js` like this:

  ```js
  module.exports = function(sam) {
    // on the server, `sam` is a Feathers application so
    // for example we can create new actions like this:
    sam.service('actions').create({
      text: 'Ping from my plugin',
      tags: [],
      action: {
        type: 'myplugin',
        ping: 'Default ping'
      }
    }, function(error, data) {
      console.log('Created', data);
    });
  };
  ```

- And a `frontend.js` like this:

  ```js
  module.exports = function(sam) {
    // sam is the client side application instance
    // which you can register new actions like this:
    sam.action('myplugin', function(element, classification) {
      // element is the jQuery wrapped main element
      // classification is an object with information about the
      // text that triggered this action
      var heading = document.createElement('h1');
      heading.className = 'myplugin';
      heading.innerHTML = 'Hello from my plugin: ' + classification.action.ping;

      element.html(heading);
    });

    // and learners (which will also show up in the help) like this
    sam.learn({
      description: 'Call myplugin',
      tags: ['name'],
      form: function(el, save) {
        el.html('<input type="text" class="param" />')
          .on('submit', function(save) {
            save({
              type: 'myplugin',
              ping: el.find('.param').val()
            });
          });
      }
    });
  };
  ```

- `styles.css` can contain any CSS styles:

  ```css
  .myplugin {
    font-size: 4em;
  }
  ```

> You'll soon have a [Yeoman](http://yeoman.io/) generator for new plugins
that initialize everything similar to what is described above so that you can
just do `$ mysam create my-plugin`.

To use the plugin run

`$ npm link`

in the plugin folder and restart the application (for easier debugging you can use the `--develop` flag).

Now saying something like:

> *Can I get a ping from my plugin please?*

Should show the element we created in the action.

## Developing

If you want to develop on this repository initialize it with

> git clone git@github.com:mysamai/mysam.git
> cd mysam
> npm install

To run the installation you *have to* compile first with

> npm run compile
> bin/mysam

To continuously watch for changes run

> npm run compile:watch

## Contributing

Contributions are very welcome! If you'd like to contribute, these [guidelines](CONTRIBUTING.md) may help you.

## License

[MySam](https://github.com/daffl/mysam) is distributed under the MIT License, [available in this repository](master/LICENSE.md). All contributions are assumed to be also licensed under the same.
