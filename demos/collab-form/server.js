/**
 * Created by dario on 11.05.17.
 */

const express = require('express');
const collabServer = require('collab-web-forms');

const app = express();
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

console.log(collabServer);