/**
 * Created by dario on 08.03.17.
 */
import sharedb from 'sharedb/lib/client';

// This line makes the WebSocket connection always use port the CollabServer port.
const host = window.location.host.replace('3000', '8080');

const webSocket = new WebSocket('ws://' + host);
const connection = new sharedb.Connection(webSocket);
export default connection;
