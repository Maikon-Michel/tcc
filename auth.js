module.exports = (jwt, JWT_SECRET) => {
    const authenticate = (token) => {
        if (!token) {
            return null;
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded.nick;
        } catch (err) {
            return null;
        }
    };
    return authenticate;
};
