/**
 * Created by dario on 11.04.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import connection from './connection';
import _ from 'underscore';

/**
 * Collaborative Rich Editor.
 *
 * Creates a new collaborative rich editor fetching data from the server and displaying it in a Quill editor
 */
export default class CollabRichEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: null,
    };

    // We extend the modules to add by default drag and drop of images
    _.extend(this.props.modules, {
      dragAndDrop: true,
    });
  }

  componentWillMount() {
    this.subscribeToDoc(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.id !== this.props.id ||
      nextProps.collectionName !== this.props.collectionName
    ) {
      this.destroy();
      this.subscribeToDoc(nextProps);
    }
  }

  subscribeToDoc(props) {
    const doc = connection.get('collab_data_' + props.collectionName, props.id);
    doc.subscribe(err => {
      if (err) throw err;
      if (doc.type === null) {
        throw Error('No document exist with id: ' + props.id);
      }
    });

    doc.on('load', load.bind(this));
    doc.on('op', update.bind(this));
    doc.on('del', del.bind(this));

    function load() {
      this.setState({ doc });
      this._editor.getEditor().setContents(doc.data);
    }

    function update(op, source) {
      // Update only if the change comes from the server
      if (!source) {
        const editor = this._editor.getEditor();
        editor.updateContents(op);
      }
    }

    function del() {
      this.destroy();
    }
  }

  destroy() {
    this.state.doc.unsubscribe();
    this.state.doc.destroy();
    this.setState({ doc: null });
  }

  handleChange(content, delta, source, editor) {
    // If we are the one making the change
    if (source === 'user') {
      this.state.doc.submitOp(delta);
    }

    if (this.props.onChange)
      this.props.onChange(content, delta, source, editor);
  }

  render() {
    return (
      <ReactQuill
        {...this.props}
        onChange={this.handleChange.bind(this)}
        ref={ref => (this._editor = ref)}
      />
    );
  }
}

CollabRichEditor.defaultProps = {
  modules: {},
};

CollabRichEditor.PropTypes = {
  docId: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
