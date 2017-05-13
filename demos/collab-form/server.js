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
const formModel = new CollabModel('forms');

// Define the schema of the data
const schema = {
  title: 'My Collaborative form',
  type: 'object',
  properties: {
    collab: {
      type: 'boolean',
      title: 'Collaborative?'
    },
    justify: {
      type: 'boolean',
      title: 'Students must justify their answers'
    },
    MCQ: {
      title: 'MCQ',
      type: 'array',
      items: {
        type: 'object',
        title: 'New Question',
        properties: {
          question: {
            type: 'string',
            title: 'Question'
          },
          answers: {
            type: 'array',
            title: 'Possible answers',
            items: {
              type: 'object',
              properties: {
                answer: {
                  type: 'string',
                  title: 'Answer'
                }
              }
            }
          }
        }
      }
    }
  }
};

// Create the shared form data
formModel.createForm('myForm', schema);
