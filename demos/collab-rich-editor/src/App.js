/**
 * Created by dario on 11.05.2017.
 */
import React, { Component } from 'react';
import { CollabRichEditor }  from '../../../dist/client';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div className="container">
        <header>
          <h1>Rich Collaborative Editor</h1>
        </header>

        <CollabRichEditor
          id="rich-editor1"
          collectionName="documents"
        />
      </div>
    );
  }
}