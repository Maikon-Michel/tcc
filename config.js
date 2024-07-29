function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.')) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}
const os = require('os');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const serviceAccount = require('../key.json');
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
host = getLocalIPAddress();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const WebSocket = require('ws');
const server = new WebSocket.Server({ host: host, port: 8080 });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://supertrunfosat-default-rtdb.firebaseio.com'
});
const db = admin.database();

module.exports = {
    host,
    app,
    db,
    jwt,
    port,
    JWT_SECRET,
    server,
    WebSocket
};
