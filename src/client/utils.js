/**
 * Created by dario on 13.05.17.
 */

import _ from 'underscore';

const availableWidgets = ['text', 'textarea', 'uri'];

export function isAvailableWidget(widget) {
  return _.contains(availableWidgets, widget);
}