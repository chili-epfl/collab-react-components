/**
 * Created by dario on 11.05.2017.
 */
import React, { Component } from 'react';
import { CollabEditor }  from '../../../dist/client';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div className="container">
        <header>
          <h1>Simple Collaborative Editor</h1>
        </header>

        <CollabEditor
          id="editor1"
          collectionName="documents"
          rows="20"
        />
      </div>
    );
  }
}