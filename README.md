# collab-meteor

Meteor Atmosphere package for smooth and quick integration of a real-time collaborative form using React

## Table of contents
- [Installation](#installation)
- [Server initialization](#server-initialization)
- [Usage](#usage)
    - [Simple collaborative Editor](#simple-collaborative-editor)
        - [Server API](#editor-server-api)
        - [Client API](#editor-client-api)
    - [Collaborative Form](#collaborative-form)
        - [Server API](#editor-server-api)
        - [Client API](#editor-client-api)
- [License](#license)
---

## Installation
- Requires React 15.4.0+.
- Requires "react-jsonschema-form" npm package.
> Note: The "master" branch of the repository reflects the published stable release.

```
$ meteor add danongba:collab-meteor
```

> Note: It is recommended to use [Bootstrap](http://getbootstrap.com/)  with this package for better rendering of the form.

## Server initialization
In order to use the collaborative functionalities, you will need to start a new
CollabMeteor server instance. One way to do it is on startup:
```JavaScript
import { CollabMeteor } from 'meteor/danongba:collab-meteor';

Meteor.startup(() => {
  CollabMeteor.startServer();
});
```
You can also stop the server by calling:

```JavaScript
CollabMeteor.stopServer();
```

## Usage
For a basic implementation, see the example Meteor app.

### Simple Collaborative Editor

To implement a simple collaborative editor (textarea), start by instantiating
a new `CollabModel` on the server, taking as parameter the name of the collaborative collection:

```JavaScript
import { CollabModel } from 'meteor/danongba:collab-meteor';

const model = new CollabModel("documents");
model.create("myEditor");
```

#### Server API

- `create(id, data = "")`: Creates a new document with `id` and with initial `data` (String).
- `remove(id)`: Deletes a document with ID `id`.

#### Client API

Just call `CollabEditor` from the client

```jsx
import React, { Component } from 'react';
import { render } from "react-dom";
import { CollabEditor } from 'meteor/danongba:collab-meteor';

render((
  <CollabEditor
    id="myEditor"
    collectionName="documents"
  />
), document.getElementById("app"));
```
Props of `CollabEditor`:
- `id`: ID of the document to fetch from the database
- `collectionName`: Name of the collection
- `rows`: "rows" attribute of the textarea
- `classNames`: default is `form-control`
- `onChange`: Function called on every modification. Returns the current value of the editor.

### Collaborative Form
>Note: The collaborative form is based on [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form)

To implement a collaborative form, start by instantiating a new `CollabFormModel` on the server,
taking as parameter the name of the collection and a schema:

```JavaScript
import { CollabModel } from 'meteor/danongba:collab-meteor';

const model = new CollabModel("forms");
const schema = {
      title: "My collaborative form",
      type: "object",
      required: ["input", "textarea"],
      properties: {
        input: {type: "string", title: "Input"},
        textarea: {type: "string", title: "Textarea", default: 'Default text'},
      }
    };
model.createForm("myForm", schema);
```
This will create a new collaborative document on the database containing the
collaborative data of the form.
#### Server API

- `create(id, schema = {})`: Creates a new document with `id` and with initial data corresponding to the schema.
- `remove(id)`: Deletes a form with ID `id`.

#### Client API

Just call `CollabForm` from the client. Every `String` in the schema will be collaborative by default.

```jsx
import React, { Component } from 'react';
import { render } from "react-dom";
import { CollabForm } from 'meteor/danongba:collab-meteor';

render((
  <CollabForm
    id="MyForm"
    collectionName="forms"
    schema={schema}
  />
), document.getElementById("app"));
```
> Note: `CollabForm` can be used exactly like `Form` from `react-jsonschema-form`
with few exceptions (see below).


Props of `CollabForm` that vary from `react-jsonschema-form`:
- `id`: ID of the form to fetch from the database
- `collectionName`: Name of the collection

The supported collaborative types are `text` and `textarea`. They can be defined in the 
`uiSchema` like:
```jsx
const uiSchema = {textarea: {"ui:widget": "textarea"} }

render((
  <CollabForm
    id="MyForm"
    collectionName="forms"
    schema={schema}
    uiSchema={uiSchema}
  />
), document.getElementById("app"));

```
>Note: `text` is the default String type.

>Note: Do not pass `formData` to `CollabForm`, the data will be fetched
from the collaboratively shared data in the database.

## Example app
An example app is present in this directory, feel free look at it for a real implementation
of `collab-meteor`.

## License
TODO
