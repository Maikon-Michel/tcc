//DEFINIÇÕES DE VARIAVEIS, CONFIGURAÇÕES E MIDWARES
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

const NUM_SALAS = 3;
let cadeiras = [];
for (let i = 0; i < NUM_SALAS; i++) {
    let linha = new Array(6).fill(null); // Inicializa cada coluna com 0 (ou qualquer valor desejado)
    cadeiras.push(linha);
}
cadeiras[1][1] = "fran" //DELETAR TESTE
//INICIO DO CÓDIGO
//TRATAMENTO DOS SOCKETS
server.on('connection', (socket) => { //INCLUIR A FUNÇÃO PARA DEIXAR MAIS TRANPARENTE
    console.log('Client connected');

    socket.on('message', (message) => {
        const data = JSON.parse(message);
        const token = data.token;
        const page = data.page;

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
            socket.removeAllListeners('message');
            //console.log(`Authenticated user: ${decoded.nick}`); //se chegou aqui é porque foi aprovado
            //socket.send('Authenticated');
            if (page == "game") { // o jogador está na página do jogo em ação

            } else { // O jogador está na página do lobby
                socket.send(JSON.stringify({
                    type: "atualiza_cadeiras",
                    cadeiras: cadeiras
                }));//envia a situação atual das cadeiras
                socket.on('message', (message) => {
                    const data = JSON.parse(message);
                    //SWITCH PARA O TIPO DE SOLICITAÇÃO
                    if (data.type === "solicita_cadeira") {
                        let r = Number(data.room);
                        let c = Number(data.chair);
                        console.log("sala: " + data.room);
                        console.log("cadeira: " + data.chair);
                        if (r > 0 && r <= NUM_SALAS && c > 0 && c < 6) {
                            if (cadeiras[data.room-1][data.chair-1]) {//cadeira está ocupada
                                console.log("cadeira ocupada"); //SIMPLESMENTE DÁ A RESPOSTA NEGATIVA
                            } else { //cadeira livre
                                console.log("cadeira livre"); //DÁ A RESPOSTA POSITIVA E AVISA OS DEMAIS CONECTADOS
                            }
                        }
                    }
                });
            }

            socket.on('close', () => {
                //SE ESTIVER OCUPANDO UMA CADEIRA PRECISA ATUALIZAR CADEIRAS E AVISAR OS CLIENTES
                //(MAS PRIMEIRO DÁ UM TEMPO DE TOLERANCIA AO CLIENTE)
                console.log('Client disconnected');
            });
        });
    });
});

const serviceAccount = require('../key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://supertrunfosat-default-rtdb.firebaseio.com'
});
const db = admin.database();

app.post('/login', async (req, res) => { // o jogador está na página de loggin (sem socket)
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

db.ref('node/ip_host').set(host) //DESNECESSÁRIO NO FUTURO. serve para avisar os clientes o IP do host, mas isso é realizado na configuração na hospedagem real
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