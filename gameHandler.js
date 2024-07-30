module.exports.handleGame = function (socket, userNick, jogos, conectados, aux) {
    conectados[userNick].page = "game";
    setTimeout(()=> console.log(conectados), 1);
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        // Adicione o código de tratamento da página de jogo em ação aqui
    });
};
//O GAME OVER PRECISA:
    //ATUALIZAR A DISPONIBILIDADE DAS SALAS
    //ATUALIZAR A PÁGINA EM conectados[userNick].page de volta ao lobby para receber broadcast novamente
    //RELIZAR ALGUMA PREMIAÇÃO AO JOGADOR VISIVEL NA PÁGINA DECK