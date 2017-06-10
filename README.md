# collab-react-components

Database backend and collaborative React components.
This package is an abstraction layer to the famous collaborative database backend [ShareDB](https://github.com/share/sharedb). 

The current available components are:
 - A simple collaborative editor
 - A rich collaborative editor based on [React-Quill](https://github.com/zenoamaro/react-quill)
 - A collaborative form based on [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form)

## Example apps
Multiple example apps are present in the `demos` directory. Feel free look at
them for a real implementation.

To start the demo applications, just clone the repository, move to the desired demo,
install the npm packages and start the application:

```
cd demos/collab-editor
npm install
npm start
```

## Table of contents
- [Installation](#installation)
- [Server initialization](#server-initialization)
    - [The CollabCollection class](#the-collabcollection-class)
- [Usage](#usage)
    - [Server API](#server-api)
    - [Simple collaborative Editor](#simple-collaborative-editor)
    - [Collaborative Form](#collaborative-form)
    - [Rich Collaborative Editor](#rich-collaborative-editor)
- [License](#license)
---

## Installation
- Requires React 15.4.0+.
> Note: The "master" branch of the repository reflects the published stable release.

```
$ npm install --save collab-react-components
```

> Note: It is recommended to use [Bootstrap](http://getbootstrap.com/) 
with this package for better rendering of the form elements.

## Server initialization
In order to use the collaborative functionalities, you will need to start a new
CollabServer instance. One way to do it is on startup:

```JavaScript
const CollabServer = require('collab-react-components').Server;

// app is you Express app for example.

CollabServer.start(app);
```
You can also stop the server by calling:

```JavaScript
CollabServer.stop();
```
> Note: See the demos for an example of implementation with an
[Express](https://expressjs.com/) server.

### The CollabCollection class

The `CollabCollection` class represents a new collaborative collection of documents on the server.
Collaborative Collections collection can be persisted to disk using MongoDB or in memory if no options
are passed to the server. To use MongoDB, set up a database and pass its URL
to the `CollabServer`. For example:

```JavaScript
const MongoClient = require('mongodb').MongoClient;

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

// Create a CollabServer instance with MongoDB
CollabServer.start(app, options);
```
>Note: For the moment, only MongoDB is supported as a persistence layer.

Once a `CollabCollection` is created, you will be able to query its content
using the `CollabCollection` methods.

## Usage
For a basic implementation, see the demos applications.

### Server API

The `CollabCollection` class methods are the following:

- `create(id, data = '')`: Creates a new collaborative document for a simple editor with `id` (String) and with initial `data` (String).
- `createForm(id, schema)`: Creates a new collaborative form with `id` (String) and with initial data corresponding to the `schema`, where
`schema` is a `react-jsonschema-form` schema.
- `createRichText(id, data='')`: Creates a new collaborative document for a rich editor with `id` (String) and with initial `data` (String).
- `remove(id)`: Deletes a document with ID `id`. 

### Simple Collaborative Editor

To implement a simple collaborative editor (textarea), start by instantiating
a new `CollabCollection` on the server, taking as parameter the name of the collaborative collection:

```JavaScript
const CollabCollection = require('collab-react-components').Collection;

const documents = new CollabCollection("documents");
documents.create("editor1");
```

#### Client API

Call `CollabEditor` from the client

```jsx
import React from 'react';
import { CollabEditor } from 'collab-react-components/dist/client';

<CollabEditor
    id="myEditor"
    collectionName="documents"
/>
```
Props of `CollabEditor`:
- `id`: ID of the document to fetch from the database
- `collectionName`: Name of the collection
- `rows`: "rows" attribute of the textarea
- `classNames`: default is `form-control`
- `onChange(text)`: Function called on every local modification.
`text` is a string representing the current value of the editor.

### Collaborative Form
>Note: The collaborative form is based on [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form)

To implement a collaborative form, start by instantiating a new `CollabCollection` on the server,
taking as parameter the name of the collection and a schema:

```JavaScript
const CollabCollection = require('collab-react-components').Collection;

const forms = new CollabCollection("forms");
const schema = {
      title: "My collaborative form",
      type: "object",
      required: ["input", "textarea"],
      properties: {
        input: {type: "string", title: "Input"},
        textarea: {type: "string", title: "Textarea", default: 'Default text'},
      }
    };
forms.createForm("form1", schema);
```
This will create a new collaborative document on the database containing the
collaborative data of the form.

#### Client API

Just call `CollabForm` from the client.

> Note: You should not use the widget `password` in a collaborative form.
At least not until the data is encrypted on the database.

```jsx
import React from 'react';
import { CollabForm } from 'collab-react-components/dist/client';

<CollabForm
    id="MyForm" 
    collectionName="forms"
/>
```
> Note: `CollabForm` can be used exactly like `Form` from `react-jsonschema-form`
with few exceptions (see below).

Props of `CollabForm` that vary from `react-jsonschema-form`:
- `id`: ID of the form to fetch from the database
- `collectionName`: Name of the collection
- You should not pass a `schema` to the `CollabForm` component.
- You should not pass `formData` to `CollabForm`, the data will be fetched
  from the collaboratively shared data in the databas

The supported collaborative String types are `text`, `textarea` and `uri`.
They can be defined in the `uiSchema` like:

```jsx
const uiSchema = {
    textarea: {"ui:widget": "textarea"},
    uri: {"ui:widget": "uri"}
}

<CollabForm
    id="MyForm"
    collectionName="forms"
    uiSchema={uiSchema}
/>

```
> Note: Other types such as `date` or `email` cannot be updated simultaneously in a collaborative manner.

At the moment, `CollabForm` only supports form schemas where the root
element is a non-nested `object` (does not contain other objects or arrays).
We are currently working on implementing `array` capabilities.

### Rich Collaborative Editor
>Note: The collaborative editor is based on [react-quill](https://github.com/zenoamaro/react-quill)

To implement a rich collaborative editor, start by instantiating a new `CollabCollection` on the server,
taking as parameter the name of the collection:

```JavaScript
const CollabCollection = require('collab-react-components').Collection;

const documents = new CollabCollection("documents");
documents.createRichText('rich-editor1', 'My initial data');
```
This will create a new collaborative document on the database containing the
collaborative data of the rich text editor.

#### Client API

Just call `CollabRichEditor` from the client.

```jsx
import React from 'react';
import { CollabRichEditor } from 'collab-react-components/dist/client';

<CollabRichEditor
    id="MyDoc"
    collectionName="documents"
/>
```

> Note: `CollabRichEditor` can be used exactly like `ReactQuill` from `react-quill`
with few exceptions (see below).


Props of `CollabRichEditor` that vary from `react-quill`:
- `id`: ID of the form to fetch from the database
- `collectionName`: Name of the collection

>Note: Do not pass `value` or `defaultValue` to `CollabRichEditor`, the data will be fetched
from the collaboratively shared data on the server.

## License
MIT
