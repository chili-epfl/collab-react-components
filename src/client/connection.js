/**
 * Created by dario on 08.03.17.
 */
import sharedb from 'sharedb/lib/client';
import WebSocket from 'reconnecting-websocket';

// This line makes the WebSocket connection always use port the CollabServer port.
const port = window.location.host.split(':')[1];
const host = window.location.host.replace(port, '8080');

const webSocket = new WebSocket('ws://' + host);
const connection = new sharedb.Connection(webSocket);

export default connection;
