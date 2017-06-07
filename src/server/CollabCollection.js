import CollabServer from './CollabServer';
import _ from 'underscore';

export default class CollabCollection {
  /**
   * @param {Object} collectionName The name of the collection to bind to ShareDB
   */
  constructor(collectionName) {
    const backend = CollabServer.backend;
    if (backend === null) {
      throw new Error(
        'CollabCollection: You should start the CollabServer before using the model.'
      );
    }

    this.connection = backend.connect();
    this.collectionName = 'collab_data_' + collectionName;
  }

  /**
   * Creates a new document.
   *
   * @param {String} id The document id
   * @param {String} data The document initial data string.
   * @returns {Doc} The Document created
   */
  create(id, data = '') {
    const doc = this.connection.get(this.collectionName, id);
    doc.fetch(err => {
      if (err) throw err;
      if (doc.type === null) {
        doc.create(data, function(err) {
          if (err) throw err;
        });
      }
    });
    return doc;
  }

  /**
   * Creates a new document for rich text editors.
   *
   * @param {String} id The document id
   * @param {String} data The document initial data string.
   * @returns {Doc} The Document created
   */
  createRichText(id, data = '') {
    const doc = this.connection.get(this.collectionName, id);
    doc.fetch(err => {
      if (err) throw err;
      if (doc.type === null) {
        doc.create([{ insert: data }], 'rich-text', function(err) {
          if (err) throw err;
          return doc;
        });
      }
    });

    return doc;
  }

  /**
   * Creates a new form given a schema.
   *
   * @param {String} id The form id
   * @param {Object} schema The form schema used to generate the data object
   * @param {function} callback The callback in case of error
   * @returns {Doc} The Form created
   */
  createForm(id, schema = {}, callback = () => {}) {
    function createString(schemaField) {
      return typeof (schemaField.default === 'undefined')
        ? ''
        : schemaField.default;
    }
    function createInteger(schemaField) {
      return typeof (schemaField.default === 'undefined')
        ? 0
        : schemaField.default;
    }
    function createObject(data, schemaField) {
      _.each(schemaField.properties, function(value, key) {
        let prop = {};
        switch (value.type) {
          case 'string':
            prop[key] = typeof value.default === 'undefined'
              ? ''
              : value.default;
            break;
          case 'boolean':
            prop[key] = typeof value.default === 'undefined'
              ? false
              : value.default;
            break;
          case 'integer':
          case 'number':
            prop[key] = typeof value.default === 'undefined'
              ? 0
              : value.default;
            break;
          default:
            prop[key] = typeof value.default === 'undefined'
              ? null
              : value.default;
        }

        _.extend(data, prop);
      });
    }

    const doc = this.connection.get(this.collectionName, id);
    doc.fetch(err => {
      if (err) throw err;
      // If the document doesn't already exist, we create it following the schema.
      if (doc.type === null) {
        let data = {};
        switch (schema.type) {
          case 'string':
            data = createString(schema);
            break;
          case 'number':
          case 'integer':
            data = createInteger(schema);
            break;
          case 'object':
            createObject(schema, data);
            break;
        }

        doc.create({ schema, data }, function(err) {
          if (err) throw err;
          return doc;
        });
      }
    });

    return doc;
  }

  /**
   * Deletes a document with ID id.
   *
   * @param {String} id  The document ID
   * @returns {void}
   */
  remove(id) {
    const doc = this.connection.get(this.collectionName, id);
    doc.subscribe(err => {
      if (err) throw err;
      doc.del();
    });
  }
}
