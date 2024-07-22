const os = require('os');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
require('dotenv').config();

function getLocalIPAddress() {// VAI SER DELETADO NA HOSPEDAGEM REAL
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

const app = express();
const port = 3000;
const host = getLocalIPAddress();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const server = new WebSocket.Server({ host: host, port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    const data = JSON.parse(message);
    const token = data.token;

    if (!token) {
      socket.send('Invalid token');
      socket.close();
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        socket.send('Invalid token');
        socket.close();
        return;
      }
      console.log(`Authenticated user: ${decoded.nick}`);
      socket.send('Authenticated');

      socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        socket.send(`Hello, ${decoded.nick}`);
      });

      socket.on('close', () => {
        console.log('Client disconnected');
      });
    });
  });
});

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://supertrunfosat-default-rtdb.firebaseio.com'
});
const db = admin.database();

app.post('/login', async (req, res) => {
  const { nick, code } = req.body;

  try {
    const snapshot = await db.ref(`users/${nick}`).once('value');
    const user = snapshot.val();

    if (user && user.code === code) {
      const token = jwt.sign({ nick }, JWT_SECRET, { expiresIn: '10h' });
      res.send(token);
    } else {
      res.status(401).send('Invalid nickname or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

db.ref('node/ip_host').set(host)
  .then(() => {
    console.log(`IP address ${host} set in Firebase at /ip_host`);
  })
  .catch((error) => {
    console.error('Erro ao definir o IP no Firebase:', error);
  });

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});

console.log(`WebSocket server is running on ws://${host}:8080`);
