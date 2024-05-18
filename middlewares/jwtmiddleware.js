const jwt = require('jsonwebtoken');

// JWT middleware
const verifyToken = (req, res, next) => {
    
    let authHeader = req.headers.authorization;
    console.log( authHeader,"qkjsnxbjqnsbnm");
    if (!authHeader) {
        return res.status(401).send({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, {expiresIn: '1h'}, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: "Authentication failed: Invalid token" });
        }
        next();
    });
};

module.exports = verifyToken;
