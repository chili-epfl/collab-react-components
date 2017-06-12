import React, { Component } from 'react';
import './App.css';
import {CollabForm} from '../../../dist/client';

class App extends Component {
    constructor(props) {
        super(props);

        this.uiSchema1 = {
            complexity: {
                'ui:placeholder': 'Choose one'
            },
            comparisons: {
                'ui:widget': 'radio',
                'ui:options': {
                    'inline': true
                },
                'ui:placeholder': 'Choose one'
            },
            performance: {
                'ui:widget': 'textarea',
                'ui:options': {
                    'rows': 5
                }
            }
        };

        this.state = {
            id: 'form1',
            uiSchema: this.uiSchema1,
        };
    }

    onChangeForm() {
        if (this.state.id === 'form1') {
            const uiSchema = {
                color: {
                    'ui:widget': 'color'
                },
                complexity: {
                    'ui:placeholder': 'Example: O(n2), O(n3)'
                },
                pivot: {
                    'ui:widget': 'range',
                },
                performance: {
                    'ui:widget': 'textarea',
                    'ui:options': {
                        'rows': 5
                    }
                }
            };

            this.setState({
                id: 'form2',
                uiSchema,
            });
        }
    }

    render() {
        return (
            <div className="container">
              <div className="row">
                <div className="col-md-10 col-md-offset-1">
                  <header>
                    <h1 className="text-center">Group exercise: Algorithmic quizz</h1>
                  </header>

                  <div className="row">
                    <CollabForm
                        id={this.state.id}
                        collectionName="forms"
                        uiSchema={this.state.uiSchema}
                        onSubmit={this.onChangeForm.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

export default App;
