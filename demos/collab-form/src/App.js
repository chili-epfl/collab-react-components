/**
 * Created by dario on 11.05.2017.
 */
import React, { Component } from 'react';
import { CollabForm }  from '../../../dist/client';

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);

    this.schema = {
      title: 'My Collaborative form',
      type: 'object',
      required: ['input', 'textarea'],
      properties: {
        input: {type: 'string', title: 'Input'},
        checkbox: {type: 'boolean', title: 'Checkbox'},
        checkbox2: {type: 'boolean', title: 'Checkbox2'},
        textarea: {type: 'string', title: 'Textarea', default: 'Default text'},
      }
    };

    this.uiSchema = {
      input: {'ui:help': 'Help text'},
      textarea: {'ui:widget': 'textarea', 'ui:options': {rows: 8} },
    };
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Collaborative Form</h1>
        </header>

        <CollabForm
          id="myForm"
          collectionName="forms"
          schema={this.schema}
          uiSchema={this.uiSchema}
        />
      </div>
    );
  }
}