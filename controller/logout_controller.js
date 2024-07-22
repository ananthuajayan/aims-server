const jwt = require('jsonwebtoken');

const logout = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract the token from the authorization header
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ message: 'Logged out successfully' });
  });
}

module.exports = { logout };

