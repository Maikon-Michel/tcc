//CONSTANTES
const NUM_SALAS = 3;

//CONFIGURAÇÕES: EXPRESS, MIDWARES, FIREBASE, WEBSOCKET, TOKEN (CRIPTOGRIA)
const {host, app, db, jwt, port, JWT_SECRET, server, WebSocket} = require('./config');
require('./handlers')(app, db, jwt, JWT_SECRET); //TRATAMENTO DE REQUISIÇÕES HTTP (handlers)

//HANDLERS PARA REQUISIÇÕES HTTP
// app.post('/login', async (req, res) => { // o jogador está na página de loggin (sem socket)
//     const { nick, code } = req.body;

//     try {
//         const snapshot = await db.ref(`users/${nick}`).once('value');
//         const user = snapshot.val();

//         if (user && user.code === code) {
//             const token = jwt.sign({ nick }, JWT_SECRET, { expiresIn: '10h' });
//             res.send(token);
//         } else {
//             res.status(401).send('Invalid nickname or password');
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).send('Internal server error');
//     }
// });

let conectados = {};
let cadeiras = []; 
let jogos = {}; //variaveis que controlam o jogo
for (let i = 0; i < NUM_SALAS; i++) {
    let linha = new Array(6).fill(null); // Inicializa cada coluna com 0 (ou qualquer valor desejado)
    cadeiras.push(linha);
    jogos[`room_${i+1}`] = null;
}

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
function broadcastUsers(message, target) { //com null a mensagem é para todos
    const mensagem = JSON.stringify(message);
    if(target){ // a mensagem tem um publico alvo
        for (const userNick in target) {
            let nomeAtual = target[userNick];
            let socketAtual = conectados[nomeAtual].socket;
            if (socketAtual && socketAtual.readyState === WebSocket.OPEN) {
                socketAtual.send(mensagem);
            }
        }
    } else { // a mensagem é para todos
        for (const userNick in conectados) {
            const socketAtual = conectados[userNick].socket;
            if (socketAtual.readyState === WebSocket.OPEN) {
                socketAtual.send(mensagem);
            }
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
        broadcastUsers(nova_cadeira_vazia, null);
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
    broadcastUsers(nova_cadeira_ocupada, null);
}
//INICIO DO CÓDIGO
//TRATAMENTO DOS SOCKETS
server.on('connection', (socket) => { //INCLUIR A FUNÇÃO PARA DEIXAR MAIS TRANPARENTE
    console.log('Client connected');

    socket.on('message', (message) => { //a primeira fase é só para tratar o token
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
            socket.removeAllListeners('message'); //haverá um branch entre jogadores do lobby e na pagina do jogo

            // Adicionar cliente ao objeto conectados
            const userNick = decoded.nick;
            db.ref(`users/${userNick}`).once('value').then((snapshot) => {//busca os dados do jogador conectado no firebase, depois atualiza o array de jogadores conectados
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
            if (page != "lobby") { // o jogador está na página do jogo em ação
                socket.send(JSON.stringify({ //ao entrar na página do game manda a mensagem
                    type: "atualiza_cadeiras",
                    cadeiras: cadeiras
                }));
                socket.on('message', (message) => {//resposta especificas aos jogadores na sala do jogo
                    const data = JSON.parse(message);

                });
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
                                ocupando_cadeira(userNick, room, chair);
                            }
                        }
                    }
                    else if(data.type === "solicita_inicio_game"){ //o lider solicita o inicio da partida
                        console.log(`Foi solicitado o inicio do jogo em ${data.room}`);
                        
                        console.log(`ocupante da sala solicitada ` + cadeiras[data.room-1][0]);
                        if(cadeiras[data.room-1][0] === userNick){//verifica se o jogador solicitante realmente é o lider da sala
                            let jogadores_da_sala = cadeiras[data.room - 1].filter(jogador => jogador !== null);
                            if(jogadores_da_sala.length < 2){ // se não tem jogador suficiente
                                socket.send(JSON.stringify({type: "jogadores_insuficientes" }));//envia a situação atual de todas cadeiras
                            } else { //tudo pronto para começar a partida da sala data.room
                                //faz um broadcast para avisar que a sala está ocupada (ocultando ela)
                                //NO GAME OVER SE DEVE REMOVER TODOS USUARIOS DA CADEIRAS E DESOCULTAR A SALA
                                for (let i = 0; i < jogadores_da_sala.length; i++) {//avisa os usuarios envolvidos para serem redimencionados
                                    const jogador_sala = jogadores_da_sala[i];  // Supondo que jogadores_da_sala contém os nicks dos usuários
                                    if (conectados[jogador_sala]) {  // Verifica se o usuário está no objeto conectados
                                        //console.log(`Dados do usuário ${jogador_sala}:`, conectados[jogador_sala].socket);  // Exibe todos os dados do usuário
                                        let socket_novo_jogador = conectados[jogador_sala].socket;
                                        socket_novo_jogador.send(JSON.stringify({ //envia a situação atual de todas cadeiras
                                            type: "partida_inicializada",
                                            room: data.room,
                                            position: i,
                                            mode: "10" //está fixo agora, AJUSTAR PARA SER EDITÁVEL AO LIDER
                                        }));
                                    } else {
                                        console.log(`ERRO! Usuário ${jogador_sala} não encontrado em 'conectados'.`);
                                    }
                                    broadcastUsers({
                                        type: "sala_sendo_ocupada",
                                        room: data.room
                                    })
                                    //  MONTAR A ESTRUTURA CORRETA QUE SERÁ USADA NO JOGO
                                    //jogos[data.room][i] = conectados[jogador_sala].code;
                                }
                                console.log(jogos);
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

db.ref('node/ip_host').set(host) //DESNECESSÁRIO NO FUTURO. serve para avisar os clientes o IP do host, mas isso é realizado na configuração na hospedagem real

app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});