/**
 * Created by dario on 04.04.17.
 */
import React, {PropTypes}  from 'react';

function CollabTextWidget(props) {
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
  const _onChange = ({ target: { value } }) => {
    return props.onChange(value === "" ? options.emptyValue : value);
  };
  return (
    <input
      className="form-control"
      readOnly={readonly}
      disabled={disabled}
      autoFocus={autofocus}
      value={value === null ? "" : value}
      {...inputProps}
      onChange={_onChange}
      onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
      ref={widgetRef}
    />
  );
}

CollabTextWidget.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  CollabTextWidget.propTypes = {
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

export default CollabTextWidget;