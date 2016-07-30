const path = require('path');
const createServer = require('mysam-server');

const app = createServer({
  port: 3030,
  public: path.join(__dirname, '..', 'public')
});

app.listen(app.get('port')).on('listening', 
  () => console.log(`Listening on ${app.get('port')}`)
);