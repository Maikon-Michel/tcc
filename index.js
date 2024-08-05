// index.js

// CONSTANTES
const NUM_SALAS = 3;

// CONFIGURAÇÕES: EXPRESS, MIDWARES, FIREBASE, WEBSOCKET, TOKEN (CRIPTOGRIA)
const { host, app, db, jwt, port, JWT_SECRET, server, WebSocket } = require('./config');
require('./handlers')(app, db, jwt, JWT_SECRET); // TRATAMENTO DE REQUISIÇÕES HTTP (handlers)
const authenticate = require('./auth')(jwt, JWT_SECRET);
const GameUtils = require('./utils'); // IMPORTA A CLASSE AUXILIAR

// IMPORTA OS HANDLERS (tratamento persolisado à página que o jogador se encontra [lobby, game, deck])
const LobbyHandler = require('./lobbyHandler');
const GameHandler = require('./gameHandler');

// INICIALIZA A CLASSE DE FUNÇÕES NECESSÁRIAS
const aux = new GameUtils(NUM_SALAS, WebSocket);

// VARIAVEIS DE CONTROLE DO JOGO E DOS JOGADORES
let conectados = {}; // lista de jogadores conectados
let em_desconexao = {}; //retenção dos dados do jogador desconectado para o caso de reconexão ficar mais fácil
let cadeiras = [];  // interção com o lobby (sistema de ocupar cadeira e sala)
let jogos = {}; // interação com as salas onde acontecem o jogos (todas variaveis de interação com cada jogo)
let salas_ocupadas = [];
aux.inicializaControle(cadeiras, jogos, salas_ocupadas); // prepara estrutura de dados

// INICIO DO CÓDIGO
// TRATAMENTO DOS SOCKETS
server.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async (message) => { // Torna a função assíncrona
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

        await aux.get_data_from_user(userNick, socket, db, conectados, em_desconexao, page, jogos); //await necessário para esperar a resposta do firebase antes de continuar

        if (page === "lobby") { 
            LobbyHandler.handleLobby(socket, userNick, cadeiras, conectados, jogos, aux, NUM_SALAS, salas_ocupadas);
        } else { 
            GameHandler.handleGame(socket, userNick, jogos, conectados, aux, salas_ocupadas, cadeiras);
        }

        socket.on('close', () => {
            if (conectados[userNick]) {// Mover dados para em_desconexao e iniciar um timer de tolerância para rentenção dos dados no node.js para não precisar buscar no fb
                em_desconexao[userNick] = {
                    dados: conectados[userNick],
                    timer: setTimeout(() => { //CHAMAR A FUNÇÃO GAME_OVER_USER(userNick) que tira o jogador da partida e se sobra só um naquela partida o declara vencedor
                        aux.active_game_over_to_player(userNick, conectados, jogos, socket, null, salas_ocupadas); //se o jogador estava no jogo e o tempo expirou, ele perde a partida
                        delete em_desconexao[userNick];
                    }, 46000) // 46 segundos   46000
                };
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
