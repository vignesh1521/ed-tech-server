const jwt = require('jsonwebtoken');

const secret = 'ABC123';

function getUserFromToken(token) {
  try {
    if (token) {
      return jwt.verify(token, secret);
    }
    return null;
  } catch (err) {
    return null;
  }
}

module.exports = { secret, getUserFromToken };
