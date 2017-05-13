import React from 'react';
import PropTypes from 'prop-types';

import CollabBaseInput from './CollabBaseInput';

function CollabURLWidget(props) {
  return <CollabBaseInput type="url" {...props} />;
}

if (process.env.NODE_ENV !== 'production') {
  CollabURLWidget.propTypes = {
    value: PropTypes.string,
  };
}

export default CollabURLWidget;