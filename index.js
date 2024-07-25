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
let conectados = {};
let cadeiras = [];
for (let i = 0; i < NUM_SALAS; i++) {
    let linha = new Array(6).fill(null); // Inicializa cada coluna com 0 (ou qualquer valor desejado)
    cadeiras.push(linha);
}
cadeiras[1][1] = "fran" //DELETAR TESTE

//FUNÇÕES AUXILIARES
function procura_usuario_nas_cadeiras(userNick) {
    // Assume-se que NUM_SALAS e cadeiras são definidos globalmente ou passados como parâmetros.
    for (let i = 0; i < NUM_SALAS; i++) {
        for (let j = 0; j < 6; j++) {
            if (userNick === cadeiras[i][j]) {
                return [i, j]; // Retorna imediatamente quando o usuário é encontrado (em JS existe o early return com motor V8)
            }
        }
    }
    return null; // Retorna null se o usuário não for encontrado após varrer todas as cadeiras
}
function broadcastUsers(message) {
    const mensagem = JSON.stringify(message);
    for (const userNick in conectados) {
        const socketAtual = conectados[userNick].socket;
        if (socketAtual.readyState === WebSocket.OPEN) {
            socketAtual.send(mensagem);
        }
    }
}
function saindo_da_cadeira_atual(userNick) {
    let antes_ocupava = procura_usuario_nas_cadeiras(userNick);
    if (antes_ocupava) {
        cadeiras[antes_ocupava[0]][antes_ocupava[1]] = null;
        let nova_cadeira_vazia = {
            type: "cadeira_liberada",
            room: Number(antes_ocupava[0]) + 1,
            chair: Number(antes_ocupava[1]) + 1
        }
        broadcastUsers(nova_cadeira_vazia);
    }
}
function ocupando_cadeira(userNick, room, chair){
   cadeiras[room - 1][chair - 1] = userNick; //ocupa nova cadeira (levando em consideração a contagem de room e chair está deslocado em +1 (iniciando em 1) em relação ao vetor (inicia em 0))
   let nova_cadeira_ocupada = {
    type: "cadeira_ocupada",
    userNick: userNick,
    room: room,
    chair: chair
    }
    broadcastUsers(nova_cadeira_ocupada);
}
//INICIO DO CÓDIGO
//TRATAMENTO DOS SOCKETS
server.on('connection', (socket) => { //INCLUIR A FUNÇÃO PARA DEIXAR MAIS TRANPARENTE
    console.log('Client connected');

    socket.on('message', (message) => {
        const data = JSON.parse(message);
        const token = data.token;
        const page = data.page;

        if (!token) {
            socket.send(JSON.stringify({ type: "Invalid token" }));
            socket.close();
            return;
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                socket.send(JSON.stringify({ type: "Invalid token" }));
                socket.close();
                return;
            }
            socket.removeAllListeners('message');
            //incluir o cliente no array de controle de clientes conectados

            // Adicionar cliente ao objeto conectados
            const userNick = decoded.nick;
            db.ref(`users/${userNick}`).once('value').then((snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    conectados[userNick] = {
                        ...userData,
                        socket: socket // Adiciona o socket ao objeto de dados do usuário
                    };
                    console.log(`Cliente ${userNick} adicionado ao objeto conectados.`);
                }
            }).catch((error) => {
                console.error('Erro ao buscar dados do usuário:', error);
            });


            //console.log(`Authenticated user: ${decoded.nick}`); //se chegou aqui é porque foi aprovado
            //socket.send('Authenticated');
            if (page == "game") { // o jogador está na página do jogo em ação

            } else { // O jogador está na página do lobby
                socket.send(JSON.stringify({ //envia a situação atual de todas cadeiras
                    type: "atualiza_cadeiras",
                    cadeiras: cadeiras
                }));
                socket.on('message', (message) => {
                    const data = JSON.parse(message);
                    if (data.type === "solicita_cadeira") {
                        let room = Math.floor(Number(data.room));
                        let chair = Math.floor(Number(data.chair));
                        console.log("sala: " + data.room);
                        console.log("cadeira: " + data.chair);
                        if (room > 0 && room <= NUM_SALAS && chair > 0 && chair <= 6) { //para evitar crash
                            if (cadeiras[room - 1][chair - 1]) {// se cadeira está ocupada (-1 porque está deslocado, começando em 1)
                                socket.send(JSON.stringify({ //envia a situação atual de todas cadeiras
                                    type: "avisa_cadeira_ocupada",
                                    ocupante_atual: cadeiras[room - 1][chair - 1]
                                }));
                            } else { //cadeira livre
                                console.log("cadeira livre");
                                saindo_da_cadeira_atual(userNick); //sai da cadeira anterior (se estiver) e avisa
                                //cadeiras[room - 1][chair - 1] = userNick; //ocupa nova cadeira
                                //realiza o broadcast para avisar todo mundo que sentou
                                ocupando_cadeira(userNick, room, chair);
                            }
                        }
                    }
                });
            }

            socket.on('close', () => {
                if (conectados[userNick]) {
                    delete conectados[userNick];
                    saindo_da_cadeira_atual(userNick);
                }
            });
        });
    });
});

const serviceAccount = require('../key.json');
const { stringify } = require('querystring');
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