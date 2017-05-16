/**
 * Created by dario on 11.05.17.
 */

const Express = require('express');
const CollabServer = require('../../dist').Server;
const CollabModel = require('../../dist').Model;

/* Create Express application */
const app = Express();
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(Express.static('client/build'));
  app.use(Express.static('node_modules/quill/dist'))
}

// Create a CollabServer instance with MongoDB
CollabServer.start(app);

// Create the collection that will hold the shared data.
const formModel = new CollabModel('documents');

// Create the shared form data
formModel.createRichText('doc1');