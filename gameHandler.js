module.exports.handleGame = function (socket, userNick, jogos, conectados, aux, salas_ocupadas, baralho) {
    function s(msg) {
        socket.send(JSON.stringify({ type: msg }));
    }

    function broadcast_troca_turno(antes, depois){
        for(let i=0; i<6; i++){
            socket_player_room = jogos[sala]?.socket[i];
            if (socket_player_room){
                socket_player_room.send(JSON.stringify({
                    type: "change_turn",
                    last: antes,
                    next: depois[i]
                }))
            }
        }
    }
    function revela_sua_carta_inical(){
        const carta = jogos[sala][`player${Number(cadeira)+1}`]?.cards[0];
        if(carta){
            socket.send(JSON.stringify({ type: "carta_inicial", card: carta }));
        }
    }

    function compara_atributos(vet, invertido){ //TESTAR MAIS CASOS DE EMPATE
        if(invertido){
            for(let i=0; i<6; i++){
                if(vet[i] != 0){
                    vet[i] = Math.floor(100 / vet[i]);
                }
            }
        }
        let index_melhor = 0;
        let empate = false; //POSIBILIDADE DE FALSOS POSITIVOS. VERIFICAR
        for(let i=1; i<6; i++){
            if(vet[i] > vet[index_melhor]){
                index_melhor = i;
                melhor = vet[i];
                empate = false;
            } else if (vet[i] == vet[index_melhor]) {
                empate = true;
            }
        }
        if (empate){
            return null;
        } else{
            return index_melhor;
        }
    }
    function make_a_move(escolha) {
        if(jogos[sala].turn % 6 == cadeira){
            console.log('cliente solicitou jogada quando era vez dele');
            let atributo_escolhido;
            let invertido = false;
            switch(escolha){
                case 0: atributo_escolhido = 'larguraDeFaixaKm'; break;
                case 1: atributo_escolhido = 'n_bandas'; break;
                case 2: atributo_escolhido = 'resolucaoEspacial_m'; invertido = true; break;
                case 3: atributo_escolhido = 'quantizacao_bits'; break;
                default: atributo_escolhido = 'revisita_dias'; invertido = true; break;
            }
            let valores_atributos = [];
            let cartas_turno_antes = [];
            for(let i=1; i<=6; i++){
                if(jogos[sala][`player${i}`]){
                    valores_atributos.push(baralho[jogos[sala][`player${i}`].cards[0]][atributo_escolhido]); //PROBLEMA COM FLOAT NA COMPARAÇÃO
                    cartas_turno_antes.push(jogos[sala][`player${i}`].cards[0]);
                } else {
                    valores_atributos.push(-1);
                    cartas_turno_antes.push(null);
                }
            }
            const index_vencedor = compara_atributos(valores_atributos, invertido);
            if(index_vencedor != null){//redistribuição de cartas de acordo com o vencedor da rodada
                let cartas_recolhidas = [];
                for(let i=1; i<=6; i++){ //recolhe as cartas de todos jogadores
                    if(jogos[sala][`player${i}`]?.cards){ //se o jogador está ativo (tendo cartas)
                        let carta_recolhida = jogos[sala][`player${i}`].cards.shift();
                        cartas_recolhidas.push(carta_recolhida);
                        if(jogos[sala][`player${i}`].cards.length < 1 && index_vencedor + 1 != i){ //ocorreu o game over do jogador quando perde todas as cartas e não é o vencedor da rodada
                            let LoserName = jogos[sala][`player${i}`].name;
                            let LoserSocket = conectados[LoserName].socket;
                            aux.active_game_over_to_player(LoserName, conectados, jogos, LoserSocket, null, salas_ocupadas);
                        }
                    }
                }
                if(jogos[sala][`player${index_vencedor + 1}`]?.cards){ //se for o caso do game over não deve executar porque as propriedades da sala foram resetadas
                    jogos[sala][`player${index_vencedor + 1}`].cards.push(...cartas_recolhidas);
                } 
            } else { // em caso de empate apenas embaralha as vezes
                for(let i=1; i<=6; i++){
                    if(jogos[sala][`player${i}`]?.cards){
                        let carta_recolhida = jogos[sala][`player${i}`].cards.shift();
                        jogos[sala][`player${i}`].cards.push(carta_recolhida);
                    }
                }
            }
            do{ //atualiza turno
                jogos[sala].turn++;
            } while(!jogos[sala][`player${jogos[sala].turn % 6+1}`] && jogos[sala].turn < 10000); //para pular as cadeiras vazias
            let cartas_turno_depois = [];
            for(let i=1; i<=6; i++){
                if(jogos[sala][`player${i}`]){
                    cartas_turno_depois.push(jogos[sala][`player${i}`].cards[0]);
                } else {
                    cartas_turno_depois.push(null);
                }
            }
            broadcast_troca_turno(cartas_turno_antes, cartas_turno_depois);
        } else { //DELETAR. APENAS PARA VERIFICAR
            console.log('cliente solicitou jogada quando não era vez dele');
            //RESPONDE QUE NÃO É A VEZ DELE
        }
        for(let i = 0; i<6; i++) console.log(jogos[sala][`player${i + 1}`]?.cards);
    }
    const sala = `room_${conectados[userNick].room}`;
    const cadeira = conectados[userNick].chair;
    if(cadeira != null) revela_sua_carta_inical(); //o jogo inicia revelando a carta.
    if (jogos[sala]?.socket[cadeira] !== undefined) jogos[sala].socket[cadeira] = socket;
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
