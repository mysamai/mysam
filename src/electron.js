import app from 'app';
import BrowserWindow from 'browser-window';
import crashReporter from 'crash-reporter';

import server from './app';

const config = require('../config.json');

let mainWindow = null;

crashReporter.start();
server.listen(process.env.PORT || config.port);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadUrl(`http://localhost:${config.port}`);
  mainWindow.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

