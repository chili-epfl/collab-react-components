/**
 * Created by dario on 13.04.17.
 */

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import _ from 'underscore';
import connection from './connection';
import CollabStringField from './fields/CollabStringField';
import CollabTextWidget from './widgets/CollabTextWidget';
import CollabTextareaWidget from './widgets/CollabTextareaWidget';
import CollabURLWidget from './widgets/CollabURLWidget';
import { getUiOptions } from 'react-jsonschema-form/lib/utils';
import { isAvailableWidget } from './utils';

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
      nonCollabKeys: null,
      isObject: true,
      isCollab: false,
    };

    // We define our custom field for collaborative text (all strings)
    _.extend(this.props.fields, {
      StringField: CollabStringField,
    });
    // We define our custom widgets
    _.extend(this.props.widgets, {
      TextWidget: CollabTextWidget,
      TextareaWidget: CollabTextareaWidget,
      URLWidget: CollabURLWidget,
    });
  }

  componentWillMount() {
    this.subscribeToForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // We should unsubscribe from the current form and subscribe to the new one
    if (
      nextProps.id !== this.props.id ||
      nextProps.collectionName !== this.props.collectionName
    ) {
      this.unsubscribe();
      this.subscribeToForm(nextProps);
    }
  }

  subscribeToForm(props) {
    const form = connection.get(
      'collab_data_' + props.collectionName,
      props.id
    );
    form.subscribe(err => {
      if (err) console.log(err);
      if (form.type === null) {
        throw Error('No form exists with id: ' + props.id);
      }
    });

    form.on('load', load.bind(this));
    form.on('op', update.bind(this));
    form.on('del', del.bind(this));

    function load() {
      switch (form.data.schema.type) {
        case 'string':
          // If the widget is not collaborative, we also have to update it !
          const { widget = 'text' } = getUiOptions(props.uiSchema);
          const isSupported = isAvailableWidget(widget);
          if (!isSupported) {
            this.setState({ form, isObject: false });
          } else {
            this.setState({ form, isObject: false, isCollab: true });
          }
          break;
        case 'object':
          // We save all non-collaborative keys
          const nonCollabKeys = [];
          const properties = form.data.schema.properties;
          Object.keys(properties).forEach(key => {
            if (properties[key].type !== 'string') {
              nonCollabKeys.push(key);
            } else if (props.uiSchema[key]) {
              // If the widget is not collaborative, we also have to update it ! Also if it is an enum
              const { widget = 'text' } = getUiOptions(props.uiSchema[key]);
              const isSupported = isAvailableWidget(widget);
              const isEnum =
                form.data.schema.properties[key].enum !== undefined;
              if (!isSupported || isEnum) {
                nonCollabKeys.push(key);
              }
            }
          });
          // Form data available only when we are done loading the form
          this.setState({ form, nonCollabKeys });
          break;
        case 'array':
          throw Error('CollabForm: Array type is not yet supported');
          break;
        default:
          this.setState({ form, isObject: false });
      }
    }

    function update(op, source) {
      // We only update if we receive a modification from outside on a non collaborative field
      if (this.state.isObject) {
        const isNonCollab = _.contains(this.state.nonCollabKeys, op[0].p[1]);
        if (!source) {
          if (this.props.onRemoteChange) {
            this.props.onRemoteChange(form.data.data);
          }
          if (isNonCollab) {
            this.setState({ form });
          }
        }
      } else if (!source && !this.state.isCollab) {
        this.setState({ form });
        if (this.props.onRemoteChange) {
          this.props.onRemoteChange(form.data.data);
        }
      }
    }

    function del() {
      this.state.form.destroy();
      this.state.form.unsubscribe();
      this.setState({ form: null });
    }
  }

  onChange(changeStatus) {
    if (this.state.isObject) {
      Object.keys(changeStatus.formData).forEach(key => {
        if (this.state.form.data.data[key] !== changeStatus.formData[key]) {
          const op = [
            { p: ['data', key], od: null, oi: changeStatus.formData[key] },
          ];
          this.state.form.submitOp(op, function(err) {
            if (err) throw err;
          });
        }
      });
    } else if (
      !this.state.isCollab &&
      this.state.form.data.data !== changeStatus.formData
    ) {
      const op = [{ p: ['data'], od: null, oi: changeStatus.formData }];
      this.state.form.submitOp(op, function(err) {
        if (err) throw err;
      });
    }

    if (this.props.onChange) this.props.onChange(changeStatus);
  }

  unsubscribe() {
    this.state.form.unsubscribe();
    this.state.form.destroy();
    this.setState({ form: null });
  }

  render() {
    return (
      this.state.form &&
      <Form
        {...this.props}
        schema={this.state.form.data.schema}
        formData={this.state.form.data.data}
        onChange={this.onChange.bind(this)}
        formContext={this.state.form}
      />
    );
  }
}

CollabForm.defaultProps = {
  uiSchema: {},
  widgets: {},
  fields: {},
  noValidate: false,
  liveValidate: false,
  safeRenderCompletion: false,
  noHtml5Validate: false,
};
