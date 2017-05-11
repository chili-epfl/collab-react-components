/**
 * Created by dario on 11.04.17.
 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import StringBinding from 'sharedb-string-binding';
import connection from './connection';

/**
 * Collaborative Editor class.
 *
 * Creates a new collaborative editor fetching data from the ShareDB collection and displaying it in a <textarea/>
 * The editor takes as props:
 * - id: ID of the document to fetch
 * - collectionName: The name of the collection
 * - classname: Optional classname to apply to the textarea
 */
class CollabEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: null
    };
  }

  componentWillMount() {
    this.subscribeToDoc(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props, nextProps)) {
      this.destroyBinding();
      this.subscribeToDoc(nextProps);
    }
  }

  destroyBinding() {
    this.state.doc.unsubscribe();
    this.state.doc.destroy();
    this.binding.destroy();
  }

  subscribeToDoc(props) {
    const comp = this;
    const doc = connection.get('collab_data_' + props.collectionName, props.id);
    doc.subscribe((err) => {
      if (err) console.log(err);
      if(doc.type === null) {
        console.log('No document exist with id: ' + props.id);
      }
    });

    doc.on('load', load);
    doc.on('del', del);

    function load() {
      comp.setState({doc: doc}, comp.createBinding);
    }

    function del() {
      comp.destroyBinding();
    }
  }

  createBinding() {
    const textArea = ReactDOM.findDOMNode(this._textarea);
    this.binding = new StringBinding(textArea, this.state.doc);
    this.binding.setup();
  }

  componentWillUnmount(){
    this.destroyBinding();
  }

  render() {
    return (
      <textarea
        onChange={this._onChange}
        ref={(ref) => this._textarea = ref}
        className={this.props.classNames}
        rows={this.props.rows}
      />
    );
  }
}

CollabEditor.defaultProps = {
  classNames: "form-control"
};

CollabEditor.PropTypes = {
  id: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  className: PropTypes.string,
  rows: PropTypes.number,
  onChange: PropTypes.func
};

export default CollabEditor;