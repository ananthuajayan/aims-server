const jwt = require('jsonwebtoken');

// jwt middleware
const verifyToken = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: "Authentication failed: Invalid token" });
        }
        next();
    });
};

module.exports = verifyToken;
