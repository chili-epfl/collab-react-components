/**
 * Created by dario on 13.05.17.
 */

import _ from 'underscore';

const availableWidgets = ['text', 'textarea', 'uri'];
const availableFormats = ['uri'];

export function isAvailableWidget(widget) {
  return _.contains(availableWidgets, widget);
}

export function isAvailableFormat(format) {
  return _.contains(availableFormats, format);
}

export function findPath(id, name) {
  const path = ['data'];
  const ids = id.split('_');

  for (let i = 1; i < ids.length; i++) {
    path.push(ids[i]);
  }

  return path;
}
