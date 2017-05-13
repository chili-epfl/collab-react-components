import React from 'react';
import PropTypes from 'prop-types';

import CollabBaseInput from './CollabBaseInput';

function CollabTextWidget(props) {
  return <CollabBaseInput {...props} />;
}

if (process.env.NODE_ENV !== 'production') {
  CollabTextWidget.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
}

export default CollabTextWidget;