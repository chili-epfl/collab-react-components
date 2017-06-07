/**
 * Created by dario on 11.05.17.
 */

const Express = require('express');
const CollabServer = require('../../dist').Server;
const CollabCollection = require('../../dist').Collection;
const MongoClient = require('mongodb').MongoClient;

/* Create Express application */
const app = Express();
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(Express.static('client/build'));
}

// Create a MongoDB server
const url = 'mongodb://localhost:27017/my-collaborative-app';
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

// Create a CollabServer instance
CollabServer.start(app, options);

// Create the collection that will hold the shared data.
const forms = new CollabCollection('forms');

// Define the schema of the data
const schemaTest = {
    "title": "Date and time widgets",
    "type": "object",
    "properties": {
        "native": {
            "title": "Native",
            "description": "May not work on some browsers, notably Firefox Desktop and IE.",
            "type": "object",
            "properties": {
                "datetime": {
                    "type": "string",
                    "format": "date-time"
                },
                "date": {
                    "type": "string",
                    "format": "date"
                }
            }
        },
        "alternative": {
            "title": "Alternative",
            "description": "These work on most platforms.",
            "type": "object",
            "properties": {
                "alt-datetime": {
                    "type": "string",
                    "format": "date-time"
                },
                "alt-date": {
                    "type": "string",
                    "format": "date"
                }
            }
        }
    }
};

const schema = {
  title: 'My Collaborative form',
  type: 'object',
  properties: {
    input: {type: 'string', title: 'Input'},
    checkbox: {type: 'boolean', title: 'Checkbox'},
    checkbox2: {type: 'boolean', title: 'Checkbox2'},
    textarea: {type: 'string', title: 'Textarea', default: 'Default text'},
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
forms.createForm('form1', schema, function(err) {
    throw err;
});
forms.createForm('form2', schema2, function(err) {
    throw err;
});
forms.createForm('formTest', schemaTest, function(err) {
  throw err;
});