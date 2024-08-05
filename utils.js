// utils.js

class GameUtils {
    constructor(NUM_SALAS, WebSocket) {
        this.NUM_SALAS = NUM_SALAS;
        this.WebSocket = WebSocket;
    }

    procura_usuario_nas_cadeiras(userNick, cadeiras) {
        for (let i = 0; i < this.NUM_SALAS; i++) {
            for (let j = 0; j < 6; j++) {
                if (userNick === cadeiras[i][j]) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    broadcastUsersLobby(message, target, conectados) {
        const mensagem = JSON.stringify(message);
        if (target) {
            for (const userNick in target) {
                let nomeAtual = target[userNick];
                let socketAtual = conectados[nomeAtual].socket;
                if (socketAtual && socketAtual.readyState === this.WebSocket.OPEN && conectados[userNick].page === "lobby") {
                    socketAtual.send(mensagem);
                }
            }
        } else {
            for (const userNick in conectados) {
                const socketAtual = conectados[userNick].socket;
                if (socketAtual.readyState === this.WebSocket.OPEN && conectados[userNick].page === "lobby") {
                    socketAtual.send(mensagem);
                }
            }
        }
    }

    saindo_da_cadeira_atual(userNick, cadeiras, conectados) {
        let antes_ocupava = this.procura_usuario_nas_cadeiras(userNick, cadeiras);
        if (antes_ocupava) {
            cadeiras[antes_ocupava[0]][antes_ocupava[1]] = null;
            let nova_cadeira_vazia = {
                type: "cadeira_liberada",
                room: Number(antes_ocupava[0]) + 1,
                chair: Number(antes_ocupava[1]) + 1
            }
            this.broadcastUsersLobby(nova_cadeira_vazia, null, conectados);
        }
    }

    ocupando_cadeira(userNick, room, chair, cadeiras, conectados) {
        cadeiras[room - 1][chair - 1] = userNick;
        let nova_cadeira_ocupada = {
            type: "cadeira_ocupada",
            userNick: userNick,
            room: room,
            chair: chair
        }
        this.broadcastUsersLobby(nova_cadeira_ocupada, null, conectados);
    }

    inicializaSala() {
        let dadosRoom = {};
        dadosRoom.turn = 0;
        dadosRoom.activite = false;
        dadosRoom.mode = 5;
        dadosRoom.timer = null;
        for (let i = 1; i <= 6; i++) {
            dadosRoom[`player${i}`] = null;
        }
        return dadosRoom;
    }

    resetRoom(codRoom, jogos) {
        jogos[`room_${codRoom}`] = this.inicializaSala();
    }

    inicializaControle(cadeiras, jogos, salas_ocupadas) {
        for (let i = 0; i < this.NUM_SALAS; i++) {
            let linha = new Array(6).fill(null);
            cadeiras.push(linha);
            this.resetRoom(i + 1, jogos);
            salas_ocupadas.push(false);
        }
    }

    async get_data_from_user(userNick, socket, db, conectados, em_desconexao, page, jogos) {
        if (em_desconexao[userNick]) {
            // Mover dados de volta para conectados
            conectados[userNick] = em_desconexao[userNick].dados;
            conectados[userNick].socket.close();
            conectados[userNick].socket = socket; //atualiza para o socket atual
            conectados[userNick].page = page; //concertado o bug do milênio
            const wasInGame = this.search_player_in_games(userNick, jogos);
            if(page != "lobby" || !wasInGame){
                clearTimeout(em_desconexao[userNick].timer); // NÃO É PARA CANCELAR SE SAIU DO JOGO PARA LOBBY
            } else{
                console.log("caso especial")
            }
            delete em_desconexao[userNick];
        } else { //se não há dados busca no banco
            try {
                const snapshot = await db.ref(`users/${userNick}`).once('value');
                const userData = snapshot.val();
                if (userData) {
                    conectados[userNick] = {
                        ...userData,
                        socket: socket,
                        page: "lobby"
                    };
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        }
    }
    search_player_in_games(player, jogos) {
        for (let i = 0; i < this.NUM_SALAS; i++) {
            for (let j = 0; j < 6; j++) {
                if (player === jogos[`room_${i+1}`]?.[`player${j+1}`]?.name) { // ?. é a forma segura de verificar, retornando undefined inves do erro
                    return [i+1, j+1];
                }
            }
        }
        return null;
    }
    active_game_over_to_player(player, conectados, jogos, socket, local, salas_ocupadas){//expulsa o jogador da sala_jogo
        if(!local){
            local = this.search_player_in_games(player, jogos);
        }
        if(local){ //sala encontrada para expulsar o jogador
            socket.send(JSON.stringify({type: "game_over_lose"}));
            jogos[`room_${local[0]}`][`player${local[1]}`] = null;
            conectados[player].page = "lobby"; //nova página onde o jogador deve ficar
            conectados[player].room = null; //nova página onde o jogador deve ficar
            conectados[player].chair = null; //nova página onde o jogador deve ficar

            let count_players = 0;
            let player_vencedor;
            for(let i=1; i<=6; i++){
                if(jogos[`room_${local[0]}`][`player${i}`]){
                    count_players++;
                    player_vencedor = i;
                }
            }
            if(count_players == 1){ // se sobrou só um jogador, ele venceu
                const userNickWinner = jogos[`room_${local[0]}`][`player${player_vencedor}`].name;
                const socketWinner = conectados[userNickWinner].socket;
                socketWinner.send(JSON.stringify({type: "game_over_win"}));
                salas_ocupadas[local[0] - 1] = false;
                this.broadcastUsersLobby({
                    type: "atualiza_disposicao_sala",
                    ocupadas: salas_ocupadas
                }, null, conectados);
                //PREMIAR O JOGADOR VENCEDOR
            }
        }
    }
}

module.exports = GameUtils;
