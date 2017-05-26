# Rich Collaborative Editor Example

A collaborative rich text editor using [Collab-Web-Forms](https://github.com/darioAnongba/collab-web-forms)

This example demonstrates
 - Implementation of a backend server using Express and websockets.
 - Initialisation of the collaborative server instance.
 - Creation of a new rich text document on the server
 - Utilisation of the CollabRichEditor component


In this demo, data is not persisted. To persist data, run a Mongo
server and initialize use id in `collab-web-forms` as follows (for example):

```javascript
const MongoClient = require('mongodb').MongoClient;

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

// Create a CollabServer instance
CollabServer.start(app, options);
```
## Install dependencies
Once the project cloned, install the dependencies
```
npm install
```

## Build JavaScript bundle and run server
You will have to run the server instance and the React App.
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)
The implementation is compatible with the create-react-app dev server.

> Note: that both servers need to be running at once for this
to work, you will need to run both `node server.js` AND `npm start` at the same time, this is don
by running (see package.json):
```
npm start
```

## Run app in browser
Load [http://localhost:3000](http://localhost:8080)

## Result
You should be able to see an editor and be able to type in it.
If you open another browser window to the same URL,
you should see the two editors synchronized in real time.

![image](https://raw.githubusercontent.com/darioAnongba/collab-web-forms/master/demos/collab-rich-editor/real-time.png)

