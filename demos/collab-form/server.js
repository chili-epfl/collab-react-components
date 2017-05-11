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
}

/* Create a MongoDB server */
const url = 'mongodb://localhost:27017/collab-form';
MongoClient.connect(url)
  .catch(function (err) {
    if (err) throw err;
  })
;

const options = {
  port: 8080,
  db: {
    type: 'mongo',
    url
  }
};

// Create a CollabServer instance with MongoDB
CollabServer.start(app, options);

// Create the collection that will hold the shared data.
const formModel = new CollabModel("forms");

// Define the schema of the data
const schema = {
  title: "My Collaborative form",
  type: "object",
  properties: {
    input: {type: "string", title: "Input"},
    checkbox: {type: "boolean", title: "Checkbox"},
    checkbox2: {type: "boolean", title: "Checkbox2"},
    textarea: {type: "string", title: "Textarea", default: 'Default text'},
  }
};

// Create the shared form data
formModel.createForm("myForm", schema);
