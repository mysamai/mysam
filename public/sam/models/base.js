import feathers from 'feathers';
import model from 'canjs-feathers';
import io from 'socketio';

export const socket = io('');
export const app = feathers().configure(feathers.socketio(socket));

export default model(app);
