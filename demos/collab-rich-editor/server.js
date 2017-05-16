/**
 * Created by dario on 11.05.17.
 */

const Express = require('express');
const MongoClient = require('mongodb').MongoClient;
const CollabServer = require('../../dist').Server;
const CollabModel = require('../../dist').Model;

/* Create Express application */
const app = Express();
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(Express.static('client/build'));
  app.use(Express.static('node_modules/quill/dist'))
}

// Create a MongoDB server
const url = 'mongodb://localhost:27017/collab-form';
MongoClient.connect(url)
  .catch(function (err) {
    if (err) throw err;
  })
;

const options = {
  db: {
    type: 'mongo',
    url
  }
};

// Create a CollabServer instance with MongoDB
CollabServer.start(app, options);

// Create the collection that will hold the shared data.
const formModel = new CollabModel('documents');

// Create the shared form data
formModel.createRichText('doc1', 'My initial data');