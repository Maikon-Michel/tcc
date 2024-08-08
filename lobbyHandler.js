module.exports.handleLobby = function (socket, userNick, cadeiras, conectados, jogos, aux, NUM_SALAS, salas_ocupadas) {
    function generateUniqueNumbers(num, max) {
        let numbers = []; // Cria um array de números de 1 até max
        for (let i = 0; i < max; i++) {
            numbers.push(i);
        }
        for (let i = numbers.length - 1; i > 0; i--) { // Embaralha o array de números
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers.slice(0, num);  // Retorna os primeiros 'num' números do array embaralhado
    }

    socket.send(JSON.stringify({
        type: "atualiza_cadeiras",
        cadeiras: cadeiras,
        ocupadas: salas_ocupadas
    }));
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(data);
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
        }
        else if (data.type === "solicita_inicio_game") {
            if (cadeiras[data.room - 1][0] === userNick) { //VERIFICAR type.mode SE REALMENTE RECEBEU O NÚMERO
                let jogadores_da_sala = cadeiras[data.room - 1].filter(jogador => jogador !== null);
                if (jogadores_da_sala.length < 2) {
                    socket.send(JSON.stringify({ type: "jogadores_insuficientes" }));
                } else { //o inicio do jogo foi aprovado para os jogadores "jogadores_da_sala"
                    aux.resetRoom(data.room, jogos);
                    let idSalaConfigurando = `room_${data.room}`;
                    jogos[idSalaConfigurando].mode = Number(data.mode);
                    jogos[idSalaConfigurando].activite = true;
                    jogos[idSalaConfigurando].turn = 0;
                    jogos[idSalaConfigurando].socket = Array(6).fill(null);
                    salas_ocupadas[Number(data.room) - 1] = true; //para torna-la indisponível no lobby 
                    for (let i = 0; i < jogadores_da_sala.length; i++) {
                        const jogador_sala = jogadores_da_sala[i];
                        if (conectados[jogador_sala]) {
                            let socket_novo_jogador = conectados[jogador_sala].socket;
                            conectados[jogador_sala].page = "game";
                            conectados[jogador_sala].chair = i;
                            conectados[jogador_sala].room = data.room;
                            cartas_selecionadas = generateUniqueNumbers(3, 12); //MUDAR PARA 133 DEPOIS // PARA O TCC NÃO HAVERÁ UM DECK. CARTAS NO ALEATÓRIO
                            socket_novo_jogador.send(JSON.stringify({
                                type: "partida_inicializada", //o jogador é desconectado com esse comando, levantando da cadeira. A sala se torna ocupada
                                room: data.room,
                                position: i+1,
                                mode: jogos[idSalaConfigurando].mode,
                                cartas: cartas_selecionadas
                            }));
                            let configP = {};
                            configP.name = jogador_sala;
                            //o atributo cards tinha em ordem de preferencia as cartas do jogador. Manda para o jogo de acordo com as favoritas
                            //configP.cards = conectados[jogador_sala].cards.slice(0, jogos[idSalaConfigurando].mode);
                            configP.cards = cartas_selecionadas;
                            configP.socket = null; //irá ser atualizado quando o jogador entrar na pagina do game
                            jogos[idSalaConfigurando][`player${i + 1}`] = configP; //configura o inicio das var dos jogos em ação
                        }
                    }
                    aux.broadcastUsersLobby({
                        type: "atualiza_disposicao_sala",
                        ocupadas: salas_ocupadas
                    }, null, conectados);
                }
            }
        }
    });
};
