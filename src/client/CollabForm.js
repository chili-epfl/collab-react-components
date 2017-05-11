/**
 * Created by dario on 13.04.17.
 */

import React, { Component } from 'react';
import Form from "react-jsonschema-form";
import connection from './connection';
import CollabStringField from './fields/CollabStringField';

/**
 * Collaborative Form class.
 *
 * Creates a new collaborative form given a schema.
 * It fetches and maintains data from the corresponding ShareDB collection and displays a react-jsonschema-form.
 * The form takes as props:
 * - id: ID of the document to fetch
 * - collectionName: The name of the collection
 * - classNames: Optional classnames to apply to the form
 */
class CollabForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: null,
      nonCollabKeys: ['checkbox']
    };

    _.extend(this.props.fields, {
      StringField: CollabStringField,
    });
  };

  componentWillMount() {
    this.subscribeToForm(this.props);
  }

  subscribeToForm(props) {
    const form = connection.get('collab_data_' + props.collectionName, props.id);
    form.subscribe((err) => {
      if (err) console.log(err);
      if(form.type === null) {
        console.log('No form data exist with id: ' + props.id);
      }
    });

    form.on('load', load.bind(this));
    form.on('op', update.bind(this));
    form.on('del', del.bind(this));

    function load() {
      // We save all non-collaborative keys TODO

      // Form data available only when we are done loading the form
      this.setState({form: form});
    }

    function update() {
      console.log('updated');
      this.setState({form: form});
    }

    function del() {
      this.state.form.destroy();
      this.state.form.unsubscribe();
      this.setState({form: null});
    }
  }

  onChange(changeStatus){
    console.log(changeStatus);
    // We update every element that is non collaborative on onChange
    _.each(this.state.nonCollabKeys, function(value) {
      const op = [{p: [value], od: null, oi: changeStatus.formData[value]}];
      this.state.form.submitOp(op, function(err) {
        if (err) { console.log(err); }
      })
    }.bind(this));

    this.props.onChange(changeStatus);
  }

  render() {
    return (
      this.state.form &&
      <Form
        {...this.props}
        onChange={this.onChange.bind(this)}
        formContext={this.state.form}
        formData={this.state.form.data}
      />
    )
  }
}

CollabForm.defaultProps = {
  uiSchema: {},
  widgets: {},
  fields: {},
  noValidate: false,
  liveValidate: false,
  safeRenderCompletion: false,
  noHtml5Validate: false
};

export default CollabForm;