const jwt = require('jsonwebtoken');

const logout = (req, res) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }
    const token = req.headers.authorization.split(" ")[1];
    res.json({ message: 'Logged out successfully' });
  }

  module.exports = {logout}
