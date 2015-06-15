import path from 'path';
import https from 'https';
import fs from 'fs';
import feathers from 'feathers';
import mongodb from 'feathers-mongodb';
import Classifier from './classifier';

const connectionString = "mongodb://localhost:27017/sam";
const key = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'));

export const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .use('/learnings', mongodb({
    connectionString,
    collection: 'learnings'
  }))
  .use('/', feathers.static(path.join(__dirname, '..', 'public')));

export const server = https.createServer({ key, cert }, app);

app.setup(server);
