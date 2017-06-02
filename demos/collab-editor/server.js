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
}

// Create a CollabServer instance
CollabServer.start(app);

// Create the collection that will hold the shared data.
const model = new CollabModel('documents');

// Create the shared form data
model.create('doc1');