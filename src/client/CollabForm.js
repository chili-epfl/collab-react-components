/**
 * Created by dario on 13.04.17.
 */

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import _ from 'underscore'
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
export default class CollabForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: null,
      nonCollabKeys: ['checkbox', 'checkbox2']
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
      if (form.type === null) {
        console.log('No form data exist with id: ' + props.id);
      }
    });

    form.on('load', load.bind(this));
    form.on('op', update.bind(this));
    form.on('del', del.bind(this));

    function load() {
      // We save all non-collaborative keys TODO

      // Form data available only when we are done loading the form
      this.setState({form});
    }

    function update(op, source) {
      // We only update if we receive a modification from outside on a non collaborative field
      const isNonCollab = _.contains(this.state.nonCollabKeys, op[0].p[0]);
      if (!source && isNonCollab) {
        this.setState({form});
      }
    }

    function del() {
      this.state.form.destroy();
      this.state.form.unsubscribe();
      this.setState({form: null});
    }
  }

  onChange(changeStatus) {
    // We update every element that is non collaborative on onChange
    Object.keys(changeStatus.formData).forEach(key => {
      if (this.state.form.data[key] !== changeStatus.formData[key]) {
        const op = [{ p: [key], od: null, oi: changeStatus.formData[key] }];
        this.state.form.submitOp(op, function(err) {
          if (err) throw err
        });
      }
    });

    if (this.props.onChange) this.props.onChange(changeStatus);
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