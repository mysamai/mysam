import feathers from 'feathers';
import model from 'canjs-feathers';
import io from 'socketio';

const socket = io('');
const client = feathers().configure(feathers.socketio(socket));

export default model(client);
