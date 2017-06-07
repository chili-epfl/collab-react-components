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
      return schemaField.default !== undefined ? schemaField.default : '';
    }
    function createInteger(schemaField) {
      return schemaField.default !== undefined ? schemaField.default : 0;
    }
    function createBoolean(schemaField) {
      return schemaField.default !== undefined;
    }

    function createObject(schemaField, data = {}) {
      _.each(schemaField.properties, function(value, key) {
        let prop = {};
        switch (value.type) {
          case 'string':
            prop[key] = createString(value);
            break;
          case 'boolean':
            prop[key] = createBoolean(value);
            break;
          case 'integer':
          case 'number':
            prop[key] = createInteger(value);
            break;
          case 'object':
            prop[key] = createObject(value);
            break;
          default:
            callback(
              Error(
                'CollabCollection: definitions, arrays and nested objects are not yet supported'
              )
            );
        }

        _.extend(data, prop);
      });

      return data;
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
          case 'boolean':
            data = createBoolean(schema);
            break;
          case 'object':
            data = createObject(schema, data);
            break;
          default:
            callback(
              Error('CollabCollection: array type is not yet supported')
            );
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
