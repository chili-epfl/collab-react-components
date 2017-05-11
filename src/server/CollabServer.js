/**
 * Created by dario on 11.05.17.
 */
import http from 'http';
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';

const CollabServer = {};

// We define the default options in case they are not overriden
const defaultOptions = {
  port: 8080,
  db: {
    type: 'in-memory',
    port: null,
    name: null
  }
};

CollabServer.start = (app = {}, options = {}) => {
  // We merge the options defined by the user
  CollabServer.options = {
    ...options,
    ...defaultOptions
  };

  const server = http.createServer(app);
  let db = {};
  if (CollabServer.db.type === 'mongo') {
    const url = 'mongodb://localhost:' + CollabServer.db.port + '/' + CollabServer.db.name;
    db = ShareDBMongo(url);
  }

  // Create the ShareDB backend (that will need to be exported)
  CollabServer.backend = new ShareDB({db});

  // Create the Websocket server
  new WebSocket.Server({server}).on('connection', function (ws) {
    CollabServer.backend.listen(new WebsocketJSONStream(ws));
    console.log('New socket client on CollabServer instance')
  });

  server.listen(CollabServer.options.port, function (err) {
    if (err) throw err;
    console.log('CollabServer: Server listening on port ' + CollabServer.options.port)
  })
};

CollabServer.stop = () => {
  if (CollabServer.backend === null) {
    console.log('CollabServer: No server instance to close. Be sure you started a server');
    return;
  }

  CollabServer.backend.close();
  console.log('CollabServer: Server stopped');
};

export { CollabServer };