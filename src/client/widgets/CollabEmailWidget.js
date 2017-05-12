import React from 'react';
import PropTypes from 'prop-types';
import BaseInput from 'react-jsonschema-form/lib/components/widgets/BaseInput';

function CollabEmailWidget(props) {
  return <BaseInput type="email" {...props}/>;
}

if (process.env.NODE_ENV !== 'production') {
  CollabEmailWidget.propTypes = {
    value: PropTypes.string,
  };
}

export default CollabEmailWidget;