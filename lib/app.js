import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import feathers from 'feathers';
import nedb from 'feathers-nedb';

import { learnings, actions } from './services';
import classifier from './classifier';

const key = fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.crt'));

export const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/actions', nedb('actions', dbPath))
  .use('/learnings', nedb('learnings', dbPath))
  .use('/classify', classifier)
  .use('/', feathers.static(path.join(__dirname, '..', 'public')));

export const server = https.createServer({ key, cert }, app);

app.setup(server);
