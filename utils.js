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

    broadcastUsers(message, target, conectados) {
        const mensagem = JSON.stringify(message);
        if (target) {
            for (const userNick in target) {
                let nomeAtual = target[userNick];
                let socketAtual = conectados[nomeAtual].socket;
                if (socketAtual && socketAtual.readyState === this.WebSocket.OPEN) {
                    socketAtual.send(mensagem);
                }
            }
        } else {
            for (const userNick in conectados) {
                const socketAtual = conectados[userNick].socket;
                if (socketAtual.readyState === this.WebSocket.OPEN) {
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
            this.broadcastUsers(nova_cadeira_vazia, null, conectados);
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
        this.broadcastUsers(nova_cadeira_ocupada, null, conectados);
    }

    inicializaSala() {
        let dadosRoom = {};
        dadosRoom.turn = 0;
        dadosRoom.activite = false;
        dadosRoom.mode = 5;
        for (let i = 1; i <= 6; i++) {
            dadosRoom[`player${i}`] = null;
        }
        return dadosRoom;
    }

    resetRoom(codRoom, jogos) {
        jogos[`room_${codRoom}`] = this.inicializaSala();
    }

    inicializaControle(cadeiras, jogos) {
        for (let i = 0; i < this.NUM_SALAS; i++) {
            let linha = new Array(6).fill(null);
            cadeiras.push(linha);
            this.resetRoom(i + 1, jogos);
        }
    }

    get_data_from_user(userNick, socket, db, conectados) {
        db.ref(`users/${userNick}`).once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                conectados[userNick] = {
                    ...userData,
                    socket: socket
                };
            }
        }).catch((error) => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
    }
}

module.exports = GameUtils;
