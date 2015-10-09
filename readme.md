# Say hi SAM

[ ![Codeship Status for daffl/mysam](https://codeship.com/projects/b26a3f10-3c66-0133-d19d-1276d5d0a1e7/status?branch=master)](https://codeship.com/projects/102258)

Sam is an open-source, web-based "intelligent" assistant. It can listen to you, learn new actions and be extended with JavaScript plugins. Sam runs a NodeJS server and as an [Electron](http://electron.atom.io/) desktop application or in a modern browser.

# Installation

Install Sam globally via:

> npm install mysam -g

And then run either the desktop application with:

> mysam

Or the server (which is available at [localhost:9090](http://localhost:9090)) via:

> mysam --server

The following command line options are available:

- __-s, --server__ - Start server mode only
- __-d, --develop__ - Start in development mode

# Getting started

At first startup Sam will load the basic frontend training data (like learning your name, provide help, saying hi or to learn something new) and ask for your name.

To talk to Sam press *CTRL + SPACE* (make sure the browser window is focused).

All inputs can be submitted with *CTRL + ENTER* (when not in a textarea).

# Plugins

Plugins can be installed via NPM. To ask Sam about the weather run:

> npm install mysam-weather -g

Then restart the application and ask something like

> What's the weather in Berlin?

# Creating plugins

To create a new plugin you need the following `package.json`:

```
{
  "name": "mysam-myplugin",
  "main": "server.js",
  "mysam": {
    "client": "frontend.js",
    "styles": "styles.css"
  }
}
```

In the same folder a `server.js` like this:

```js
module.exports = function(sam) {
  // `sam` is a Feathers application so
  // for example we can create new actions like this:
  sam.service('actions').create({
    text: 'Ping from my plugin',
    tags: [],
    action: {
      type: 'myplugin'
    }
  });
}
```

And a `frontend.js` like this:

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
    heading.innerHTML = 'Hello from my plugin';

    element.html(heading);
  });

  // and learners (which will also show up in the help) like this
  sam.learn({
    description: 'Call myplugin',
    tags: ['name'],
    form(el, save) {
      el.html(`<input type="text" class="param" />`)
        .on('submit', () => save({
          type: 'myplugin',
          ping: el.find('.param').val()
        }));
    }
  });
}
```

`styles.css` can contain any CSS styles:

```css
.myplugin {
  font-size: 4em;
}
```

To use the plugin run

> npm link

in the plugin folder and restart the Sam application.

Now saying something like

> Can I get a ping from my plugin please?

Should show the element we created in the action.
