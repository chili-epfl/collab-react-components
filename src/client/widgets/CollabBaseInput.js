/**
 * Created by dario on 13.05.17.
 */
import React from 'react';
import PropTypes from 'prop-types';

function CollabBaseInput(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  const {
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    options,
    schema,
    formContext,
    registry,
    widgetRef,
    ...inputProps
  } = props;

  inputProps.type = options.inputType || inputProps.type || 'text';
  const _onChange = ({ target: { value } }) => {
    return props.onChange(value === '' ? options.emptyValue : value);
  };
  return (
    <input
      className="form-control"
      readOnly={readonly}
      disabled={disabled}
      autoFocus={autofocus}
      value={value === null ? '' : value}
      {...inputProps}
      onChange={_onChange}
      onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
      ref={widgetRef}
    />
  );
}

CollabBaseInput.defaultProps = {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  CollabBaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };
}

export default CollabBaseInput;