/**
 * Created by Dario on 11.05.17.
 */

import CollabServer from './server/CollabServer';
import CollabModel from './server/CollabModel';

const CollabWebForms = {};
CollabWebForms.Server = CollabServer;
CollabWebForms.Model = CollabModel;

module.exports = CollabWebForms;