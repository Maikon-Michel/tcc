module.exports.handleGame = function (socket, userNick, jogos, conectados, aux, salas_ocupadas) {
    socket.on('message', (message) => {
        msg = JSON.parse(message);
        // Adicione o código de tratamento da página de jogo em ação aqui
        switch(msg){
            case 'verifique_se_estou_na_pagina_certa':
                console.log("pediu para verficar pagina certa");
                
                break;
            case 'teste_derrota':
                console.log("pediu para verficar derrota");
                aux.active_game_over_to_player(userNick, conectados, jogos, socket, null, salas_ocupadas);
                break;
        }
    });
};