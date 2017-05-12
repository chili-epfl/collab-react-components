/**
 * Created by dario on 04.04.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringBinding from 'sharedb-string-binding';
import CollabTextareaWidget from '../widgets/CollabTextareaWidget';
import CollabTextWidget from '../widgets/CollabTextWidget';

import {
  getUiOptions,
  getDefaultRegistry,
} from 'react-jsonschema-form/lib/utils';

class CollabStringField extends Component {
  componentDidMount() {
    this.createBinding();
  }

  componentWillUnmount() {
    this.destroyBinding();
  }

  createBinding() {
    this.binding = new StringBinding(this._widget, this.props.formContext, [this.props.name]);
    this.binding.setup();
  }

  destroyBinding() {
    this.props.formContext.unsubscribe();
    this.props.formContext.destroy();
    this.binding.destroy();
  }

  static getWidget(widget) {
    switch (widget) {
      case 'text':
        return CollabTextWidget;
      case 'textarea':
        return CollabTextareaWidget;
      default:
        console.log('Unsupported collaborative type');
    }
  }

  render() {
    const {
      schema,
      name,
      uiSchema,
      idSchema,
      formData,
      required,
      disabled,
      readonly,
      autofocus,
      registry,
      onChange,
      onBlur,
    } = this.props;

    const { title } = schema;
    const { formContext } = registry;
    const defaultWidget = 'text';
    const { widget = defaultWidget, placeholder = '', ...options } = getUiOptions(
      uiSchema
    );
    const Widget = CollabStringField.getWidget(widget);

    return (
      <Widget
        options={{ ...options }}
        schema={schema}
        id={idSchema && idSchema.$id}
        label={title === undefined ? name : title}
        value={formData}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
        registry={registry}
        placeholder={placeholder}
        widgetRef={w => this._widget = w}
      />
    );

  }
}

if (process.env.NODE_ENV !== 'production') {
  CollabStringField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    formData: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
    formContext: PropTypes.object.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
  };
}

CollabStringField.defaultProps = {
  uiSchema: {},
  registry: getDefaultRegistry(),
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default CollabStringField;