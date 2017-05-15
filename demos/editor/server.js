/**
 * Created by dario on 11.05.17.
 */

const Express = require('express');
// const MongoClient = require('mongodb').MongoClient;
const CollabServer = require('../../dist').Server;
const CollabModel = require('../../dist').Model;

/* Create Express application */
const app = Express();
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(Express.static('client/build'));
}

/* // If you wish to use MongDB as a persistence layer, uncomment here and import

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

*/

// Create a CollabServer instance with MongoDB
CollabServer.start(app);

// Create the collection that will hold the shared data.
const formModel = new CollabModel('forms');

// Define the schema of the data
const schema = {
  title: 'My Collaborative form',
  type: 'object',
  properties: {
    input: {type: 'string', title: 'Input'},
    checkbox: {type: 'boolean', title: 'Checkbox'},
    checkbox2: {type: 'boolean', title: 'Checkbox2'},
    textarea: {type: 'string', title: 'Textarea', default: 'Default text'}
  }
};

const schema2 = {
  title: 'My Collaborative form 2',
  type: 'object',
  properties: {
    field1: {type: 'string', title: 'Field 1 - Input'},
    field2: {type: 'boolean', title: 'Field 2 - Checkbox'},
    field3: {type: 'string', title: 'Field 3 - Textarea', default: 'Field 3 default text'},
    field4: {type: 'number', title: 'Field 4 - Number'}
  }
};

// Create the shared form data
formModel.createForm('form1', schema);
formModel.createForm('form2', schema2);