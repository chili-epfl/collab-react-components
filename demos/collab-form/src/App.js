/**
 * Created by dario on 11.05.2017.
 */
import React, { Component } from 'react';
import { CollabForm }  from '../../../dist/client';

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 'formTest',
      uiSchema: {
          "boolean": {
              "radio": {
                  "ui:widget": "radio"
              },
              "select": {
                  "ui:widget": "select"
              }
          },
          "string": {
              "textarea": {
                  "ui:widget": "textarea",
                  "ui:options": {
                      "rows": 5
                  }
              },
              "color": {
                  "ui:widget": "color"
              }
          },
          "secret": {
              "ui:widget": "hidden"
          },
          "disabled": {
              "ui:disabled": true
          },
          "readonly": {
              "ui:readonly": true
          },
          "widgetOptions": {
              "ui:options": {
                  "backgroundColor": "yellow"
              }
          }
      }
    };
  }

  onChangeForm() {
    if (this.state.id === 'form1') {
      this.setState({
        id: 'form2',
        uiSchema: {
          field3: {'ui:widget': 'textarea', 'ui:options': {rows: 8}},
          field4: {'ui:widget': 'range'},
        }
      })
    } else {
      this.setState({
        id: 'form1',
        uiSchema: {
          textarea: {'ui:widget': 'textarea', 'ui:options': {rows: 8} },
        }
      })
    }
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Collaborative Form</h1>
        </header>

        <CollabForm
          id={this.state.id}
          collectionName="forms"
          uiSchema={this.state.uiSchema}
        />

        <button onClick={this.onChangeForm.bind(this)}>Switch form</button>
      </div>
    );
  }
}