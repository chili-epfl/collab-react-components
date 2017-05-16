/**
 * Created by dario on 11.04.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringBinding from 'sharedb-string-binding';
import connection from './connection';

/**
 * Collaborative Editor.
 *
 * Creates a new collaborative editor fetching data from the server and displaying it in a <textarea/>
 */
export default class CollabEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: null,
    };
  }

  componentWillMount() {
    this.subscribeToDoc(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.id !== this.props.id ||
      nextProps.collectionName !== this.props.collectionName
    ) {
      this.destroyBinding();
      this.subscribeToDoc(nextProps);
    }
  }

  subscribeToDoc(props) {
    const doc = connection.get('collab_data_' + props.collectionName, props.id);
    doc.subscribe(err => {
      if (err) console.log(err);
      if (doc.type === null) {
        throw Error('No document exist with id: ' + props.id);
      }
    });

    doc.on('load', load.bind(this));
    doc.on('del', del.bind(this));

    function load() {
      this.setState({ doc }, this.createBinding);
    }

    function del() {
      this.destroyBinding();
    }
  }

  createBinding() {
    this.binding = new StringBinding(this._textarea, this.state.doc);
    this.binding.setup();
  }

  destroyBinding() {
    this.state.doc.unsubscribe();
    this.state.doc.destroy();
    this.binding.destroy();
    this.setState({ doc: null });
  }

  render() {
    return (
      <textarea
        onChange={this.props.onChange}
        ref={ref => (this._textarea = ref)}
        className={this.props.classNames}
        rows={this.props.rows}
      />
    );
  }
}

CollabEditor.defaultProps = {
  classNames: 'form-control',
};

CollabEditor.PropTypes = {
  id: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  className: PropTypes.string,
  rows: PropTypes.number,
  onChange: PropTypes.func,
};
