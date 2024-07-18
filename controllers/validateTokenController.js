const jwt = require('jsonwebtoken');

const validateTokenController = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(200).json({ message: 'Token is valid', user: decoded });
  });
};

module.exports = validateTokenController;
