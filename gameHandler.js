module.exports.handleGame = function (socket, userNick, jogos, conectados, aux, salas_ocupadas, cadeiras) {
    function s(msg) {
        socket.send(JSON.stringify({ type: msg }));
    }
    function make_a_move(escolha) {
        //console.log("realizei uma jogada");
        //console.log(userNick);
        //console.log(sala);
        if(jogos[sala].turn % 6 == cadeira){
            console.log('cliente solicitou jogada quando era vez dele');
            
            do{ //atualiza turno
                jogos[sala].turn++
            } while(!jogos[sala][`player${jogos[sala].turn % 6+1}`]); //para pular as cadeiras vazias
        } else { //DELETAR. APENAS PARA VERIFICAR
            console.log('cliente solicitou jogada quando não era vez dele');
        }
    }
    const sala = `room_${conectados[userNick].room}`;
    const cadeira = conectados[userNick].chair;
    socket.on('message', (message) => {
        msg = JSON.parse(message);
        switch (msg.type) {
            case 'teste_derrota':
                console.log("pediu para verficar derrota");
                aux.active_game_over_to_player(userNick, conectados, jogos, socket, null, salas_ocupadas);
                break;
            case 'amIPlaying': // se o jogador não está jogando em uma sala, expulsa ele
                let position = aux.search_player_in_games(userNick, jogos);
                if (!position) {
                    s("out_of_game");
                }
                break;
            case 'play':
                make_a_move(msg.atributo);
                break;
        }
    });
};
