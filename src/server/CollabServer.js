/**
 * Created by dario on 11.05.17.
 */
import http from 'http';
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import RichText from 'rich-text';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';

const CollabServer = {};

// We define the default options in case they are not overriden
const defaultOptions = {
  port: 8080,
  db: {
    type: 'in-memory',
    url: null,
  },
};

CollabServer.start = (app = {}, options = {}) => {
  // We merge the options defined by the user
  CollabServer.options = {
    ...defaultOptions,
    ...options,
  };

  const server = http.createServer(app);
  let db = null;
  if (CollabServer.options.db.type === 'mongo') {
    db = CollabServer.options.db.url
      ? ShareDBMongo(CollabServer.options.db.url)
      : {};
    console.log('CollabServer: Using MongoDB adapter');
  } else {
    console.log(
      'CollabServer: No Database specified, falling back to In Memory'
    );
  }

  // Create the ShareDB backend (that will need to be exported)
  ShareDB.types.register(RichText.type);
  CollabServer.backend = new ShareDB({ db });

  // Create the Websocket server
  new WebSocket.Server({ server }).on('connection', function(ws) {
    CollabServer.backend.listen(new WebsocketJSONStream(ws));
    console.log('New socket client on CollabServer instance');
  });

  server.listen(CollabServer.options.port, function(err) {
    if (err) throw err;
    console.log(
      'CollabServer: Server listening on port ' + CollabServer.options.port
    );
  });
};

CollabServer.stop = () => {
  if (CollabServer.backend === null) {
    console.log(
      'CollabServer: No server instance to close. Be sure you started a server'
    );
    return;
  }

  CollabServer.backend.close();
  console.log('CollabServer: Server stopped');
};

export default CollabServer;
