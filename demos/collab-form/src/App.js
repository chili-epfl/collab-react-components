/**
 * Created by dario on 11.05.2017.
 */
import React, { Component } from 'react';
import { CollabForm }  from '../../../dist/client';

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);

    this.uiSchema = {
      input: {'ui:widget': 'uri'},
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
          uiSchema={this.uiSchema}
        />
      </div>
    );
  }
}