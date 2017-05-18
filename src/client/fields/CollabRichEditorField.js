/**
 * Created by dario on 04.04.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollabEditorWidget from '../widgets/CollabEditorWidget';
import {
  getUiOptions,
  getDefaultRegistry,
} from 'react-jsonschema-form/lib/utils';

class CollabEditorField extends Component {
  handleChange(content, delta, source, editor) {
    // If we are the one making the change
    console.log(delta);
    if (source === 'user') {
      const op = [{ p: ['data', this.props.name], t: 'rich-text', o: delta }];
      this.props.formContext.submitOp(op, function(err) {
        if (err) throw err;
      });
    }

    if (this.props.onChange) {
      this.props.onChange(content, delta, source, editor);
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
      readonly,
      onChange,
      onBlur,
      registry = getDefaultRegistry(),
    } = this.props;

    const { title } = schema;
    const { formContext } = registry;
    const { placeholder = '', className = '', ...options } = getUiOptions(
      uiSchema
    );

    if (options.emptyValue === undefined) options.emptyValue = '';

    return (
      <CollabEditorWidget
        options={{ ...options }}
        schema={schema}
        id={idSchema && idSchema.$id}
        className={className}
        label={title === undefined ? name : title}
        defaultValue={formData}
        onChange={this.handleChange.bind(this)}
        onBlur={onBlur}
        required={required}
        readonly={readonly}
        formContext={formContext}
        registry={registry}
        placeholder={placeholder}
        ref={ref => (this._widget = ref)}
      />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  CollabEditorField.propTypes = {
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
  };
}

CollabEditorField.defaultProps = {
  uiSchema: {},
  registry: getDefaultRegistry(),
  disabled: false,
  readonly: false,
};

export default CollabEditorField;
