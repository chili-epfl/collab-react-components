/**
 * Created by dario on 04.04.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringBinding from 'sharedb-string-binding';
import { isAvailableWidget, isAvailableFormat, findPath } from '../utils';
import {
  getWidget,
  getUiOptions,
  optionsList,
  getDefaultRegistry,
} from 'react-jsonschema-form/lib/utils';

class CollabStringField extends Component {
  constructor(props) {
    super(props);

    const { widget = 'text' } = getUiOptions(this.props.uiSchema);
    const availWidget = isAvailableWidget(widget);
    const availFormat = isAvailableFormat(this.props.schema.format);

    // It's collaborative only if it's an available widget, a string and not a date or email:
    this.isCollab =
      availWidget &&
      this.props.schema.type === 'string' &&
      (this.props.schema.format === undefined || availFormat) &&
      this.props.schema.enum === undefined;
  }

  componentDidMount() {
    if (this.isCollab) {
      this.createBinding();
    }
  }

  componentWillUnmount() {
    if (this.isCollab) this.destroyBinding();
  }

  createBinding() {
    // If it's a single value, we don't define a path
    const path = findPath(this.props.idSchema.$id, this.props.name);
    this.binding = new StringBinding(
      this._widget,
      this.props.formContext,
      path
    );
    this.binding.setup();
  }

  destroyBinding() {
    this.binding.destroy();
  }

  static getWidget(schema, widget, widgets) {
    if (widget === 'password') {
      throw Error(
        'You should not use the widget "password" within a collaborative form'
      );
    } else {
      return getWidget(schema, widget, widgets);
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
      onChange,
      onBlur,
      registry = getDefaultRegistry(),
    } = this.props;

    const { title, format } = schema;
    const { widgets, formContext } = registry;
    const enumOptions = Array.isArray(schema.enum) && optionsList(schema);
    const defaultWidget = format || (enumOptions ? 'select' : 'text');
    const {
      widget = defaultWidget,
      placeholder = '',
      ...options
    } = getUiOptions(uiSchema);

    const Widget = CollabStringField.getWidget(schema, widget, widgets);

    const ref = {};
    if (this.isCollab) ref.widgetRef = w => (this._widget = w);

    if (options.emptyValue === undefined) options.emptyValue = '';

    return (
      <Widget
        options={{ ...options, enumOptions }}
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
        {...ref}
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
