module.exports = function(app, db, jwt, JWT_SECRET) {
    app.post('/login', async (req, res) => {
        const { nick, code } = req.body;

        try {
            const snapshot = await db.ref(`users/${nick}`).once('value');
            const user = snapshot.val();

            if (user && user.code === code) {
                const token = jwt.sign({ nick }, JWT_SECRET, { expiresIn: '10h' });
                res.send(token);
            } else {
                res.status(401).send('Invalid nickname or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal server error');
        }
    });

    // Adicione outras rotas HTTP conforme necessário
};
