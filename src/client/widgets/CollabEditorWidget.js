/**
 * Created by dario on 04.04.17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';

function CollabEditorWidget(props) {
  const {
    id,
    className,
    options,
    placeholder,
    defaultValue,
    readonly,
    onChange,
    widgetRef,
  } = props;

  return (
    <ReactQuill
      id={id}
      className={className}
      theme={options.theme}
      defaultValue={typeof defaultValue === 'undefined' ? '' : defaultValue}
      placeholder={placeholder}
      readOnly={readonly}
      onChange={onChange}
      ref={widgetRef}
    />
  );
}

CollabEditorWidget.defaultProps = {
  options: { theme: 'snow' },
};

if (process.env.NODE_ENV !== 'production') {
  CollabEditorWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      theme: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };
}

export default CollabEditorWidget;
