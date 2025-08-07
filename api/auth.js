const { AuthenticationError } = require('apollo-server-express');
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


const requireAuth = (resolver) => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('Authentication required');
    }
    return resolver(parent, args, context, info);
  };
};


module.exports = { secret, getUserFromToken,requireAuth };
