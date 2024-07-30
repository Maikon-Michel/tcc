module.exports.handleGame = function (socket, userNick, jogos, conectados, aux) {
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        // Adicione o código de tratamento da página de jogo em ação aqui
    });
};
