/**
 * Created by dario on 11.05.17.
 */

import express from 'express';
import collabServer from 'collab-web-forms';

const app = express();
app.use(express.static('static'));

console.log(app);
console.log('salut');
console.log(collabServer);