module.exports.handleLobby = function (socket, userNick, cadeiras, conectados, jogos, aux, NUM_SALAS, salas_ocupadas) {
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
                } else { //o inicio do jogo foi aprovado para os jogadores "jogadores_da_sala"
                    aux.resetRoom(data.room, jogos);
                    let idSalaConfigurando = `room_${data.room}`;
                    jogos[idSalaConfigurando].mode = 10;
                    jogos[idSalaConfigurando].activite = true;
                    salas_ocupadas[Number(data.room) - 1] = true;
                    for (let i = 0; i < jogadores_da_sala.length; i++) {
                        const jogador_sala = jogadores_da_sala[i];
                        if (conectados[jogador_sala]) {
                            let socket_novo_jogador = conectados[jogador_sala].socket;
                            //conectados[jogador_sala].page = "game";
                            socket_novo_jogador.send(JSON.stringify({
                                type: "partida_inicializada",
                                room: data.room,
                                position: i,
                                mode: "10"
                            }));
                            let configP = {};
                            configP.name = jogador_sala;
                            configP.cards = conectados[jogador_sala].cards; //ISSO DEVE SER AJUSTADO DEPOIS DA IMPOLEMENTAÇÃO DA SALA "DECK"
                            jogos[idSalaConfigurando][`player${i + 1}`] = configP; //configura o inicio das var dos jogos em ação
                        }
                    }
                    aux.broadcastUsersLobby({ //ISSO DEVERIA SER SÓ PARA OS JOGADORES DO LOBBY
                        type: "atualiza_disposicao_sala",
                        ocupadas: salas_ocupadas
                    }, null, conectados);
                }
            }
        }
    });
};
