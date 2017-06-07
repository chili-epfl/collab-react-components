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
    "title": "Widgets",
    "type": "object",
    "properties": {
        "stringFormats": {
            "type": "object",
            "title": "String formats",
            "properties": {
                "email": {
                    "type": "string",
                    "format": "email"
                },
                "uri": {
                    "type": "string",
                    "format": "uri"
                }
            }
        },
        "boolean": {
            "type": "object",
            "title": "Boolean field",
            "properties": {
                "default": {
                    "type": "boolean",
                    "title": "checkbox (default)",
                    "description": "This is the checkbox-description"
                },
                "radio": {
                    "type": "boolean",
                    "title": "radio buttons",
                    "description": "This is the radio-description"
                },
                "select": {
                    "type": "boolean",
                    "title": "select box",
                    "description": "This is the select-description"
                }
            }
        },
        "string": {
            "type": "object",
            "title": "String field",
            "properties": {
                "default": {
                    "type": "string",
                    "title": "text input (default)"
                },
                "textarea": {
                    "type": "string",
                    "title": "textarea"
                },
                "color": {
                    "type": "string",
                    "title": "color picker",
                    "default": "#151ce6"
                }
            }
        },
        "secret": {
            "type": "string",
            "default": "I'm a hidden string."
        },
        "disabled": {
            "type": "string",
            "title": "A disabled field",
            "default": "I am disabled."
        },
        "readonly": {
            "type": "string",
            "title": "A readonly field",
            "default": "I am read-only."
        },
        "widgetOptions": {
            "title": "Custom widget with options",
            "type": "string",
            "default": "I am yellow"
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