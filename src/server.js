const path = require('path');
const createServer = require('mysam-server');
const feathers = require('feathers');

const app = createServer({
  port: 3030,
  public: path.join(__dirname, '..', 'node_modules', 'mysam-frontend'),
  plugins: path.join(__dirname, '..', '..', 'plugins'),
  paginate: { default: 100, max: 1000 }
});

app.use('/node_modules', feathers.static(path.join(__dirname, '..', 'node_modules')));

app.listen(app.get('port')).on('listening', 
  () => console.log(`Listening on ${app.get('port')}`)
);
