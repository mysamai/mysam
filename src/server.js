const path = require('path');
const createServer = require('mysam-server');

const app = createServer({
  port: 3030,
  public: path.join(__dirname, '..', '..', 'mysam-frontend'),
  plugins: path.join(__dirname, '..', '..', 'plugins'),
  paginate: { default: 100, max: 1000 }
});

app.listen(app.get('port')).on('listening', 
  () => console.log(`Listening on ${app.get('port')}`)
);
