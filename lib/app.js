import path from 'path';
import https from 'https';
import fs from 'fs';
import feathers from 'feathers';

var privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'));
var certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'));

export const app = feathers()
  .configure(feathers.socketio())
  .use('/', feathers.static(path.join(__dirname, '..', 'public')));

export const server = https.createServer({
  key: privateKey,
  cert: certificate
}, app);
