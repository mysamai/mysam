import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import rx from 'feathers-reactive';
import RxJS from 'rxjs';
import Recognizer from './services/recognizer';

const socket = io();
const app = feathers()
  .configure(socketio(socket))
  .configure(rx(RxJS));

app.use('/recognizer', new Recognizer());
app.setup();

export default app;
