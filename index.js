// index.js

// CONSTANTES
const NUM_SALAS = 3;

// CONFIGURAÇÕES: EXPRESS, MIDWARES, FIREBASE, WEBSOCKET, TOKEN (CRIPTOGRIA)
const { host, app, db, jwt, port, JWT_SECRET, server, WebSocket } = require('./config');
require('./handlers')(app, db, jwt, JWT_SECRET); // TRATAMENTO DE REQUISIÇÕES HTTP (handlers) [login]
const authenticate = require('./auth')(jwt, JWT_SECRET);
const GameUtils = require('./utils'); // IMPORTA A CLASSE AUXILIAR

// INICIALIZA A CLASSE COM AS VARIAVEIS NECESSÁRIAS
const aux = new GameUtils(NUM_SALAS, WebSocket);

// VARIAVEIS DE CONTROLE DO JOGO E DOS JOGADORES
let conectados = {}; // lista de jogadores conectados
let cadeiras = [];  // interção com o lobby (sistema de ocupar cadeira e sala)
let jogos = {}; // interação com as salas onde acontecem o jogos (todas variaveis de interação com cada jogo)
aux.inicializaControle(cadeiras, jogos); // prepara estrutura de dados

// INICIO DO CÓDIGO
// TRATAMENTO DOS SOCKETS
server.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        const token = data.token;
        const page = data.page;
        const userNick = authenticate(token);
        if (!userNick) {
            socket.send(JSON.stringify({ type: "Invalid token" }));
            socket.close();
            return;
        }
        socket.removeAllListeners('message'); // O jogador foi aprovado na autenticação e será redimensionado para outro tratamento

        aux.get_data_from_user(userNick, socket, db, conectados);
        if (page != "lobby") { //o jogador está na página de ação
            socket.on('message', (message) => {
                const data = JSON.parse(message);
                // Adicione o código de tratamento da página de jogo em ação aqui
            });
        } else { //o jogador está no lobby
            let salas_ocupadas = [true, false, false];
            socket.send(JSON.stringify({
                type: "atualiza_cadeiras",
                cadeiras: cadeiras,
                ocupadas: salas_ocupadas
            }));
            socket.on('message', (message) => {
                const data = JSON.parse(message);
                if (data.type === "solicita_cadeira") {
                    let room = Math.floor(Number(data.room));
                    let chair = Math.floor(Number(data.chair));
                    if (room > 0 && room <= NUM_SALAS && chair > 0 && chair <= 6) {
                        if (cadeiras[room - 1][chair - 1]) {
                            socket.send(JSON.stringify({
                                type: "avisa_cadeira_ocupada",
                                ocupante_atual: cadeiras[room - 1][chair - 1]
                            }));
                        } else {
                            aux.saindo_da_cadeira_atual(userNick, cadeiras, conectados);
                            aux.ocupando_cadeira(userNick, room, chair, cadeiras, conectados);
                        }
                    }
                } else if (data.type === "solicita_inicio_game") {
                    if (cadeiras[data.room - 1][0] === userNick) {
                        let jogadores_da_sala = cadeiras[data.room - 1].filter(jogador => jogador !== null);
                        if (jogadores_da_sala.length < 2) {
                            socket.send(JSON.stringify({ type: "jogadores_insuficientes" }));
                        } else {
                            aux.resetRoom(data.room, jogos);
                            let idSalaConfigurando = `room_${data.room}`;
                            jogos[idSalaConfigurando].mode = 10;
                            jogos[idSalaConfigurando].activite = true;
                            for (let i = 0; i < jogadores_da_sala.length; i++) {
                                const jogador_sala = jogadores_da_sala[i];
                                if (conectados[jogador_sala]) {
                                    let socket_novo_jogador = conectados[jogador_sala].socket;
                                    socket_novo_jogador.send(JSON.stringify({
                                        type: "partida_inicializada",
                                        room: data.room,
                                        position: i,
                                        mode: "10"
                                    }));
                                    let configP = {};
                                    configP.name = jogador_sala;
                                    configP.cards = conectados[jogador_sala].cards;
                                    jogos[idSalaConfigurando][`player${i + 1}`] = configP;
                                }
                            }
                            aux.broadcastUsers({
                                type: "sala_sendo_ocupada",
                                room: data.room
                            }, null, conectados);
                        }
                    }
                }
            });
        }

        socket.on('close', () => {
            if (conectados[userNick]) {
                delete conectados[userNick];
                aux.saindo_da_cadeira_atual(userNick, cadeiras, conectados);
            }
        });
    });
});

db.ref('node/ip_host').set(host);

app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});
