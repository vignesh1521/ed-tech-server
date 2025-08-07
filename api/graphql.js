const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const express = require('express');
const jwt = require('jsonwebtoken');
const { typeDefs, resolvers } = require('./schema'); 
const { users, CourseEnrolled } = require('./users');
const { secret } = require('./auth');


let server;
let app;
let apolloServerHandler;

async function getApolloHandler() {
  if (!apolloServerHandler) {
    app = express();

    app.use((req, res, next) => {
      res.setHeader("X-Powered-By", "Node.js");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader(
        'Content-Security-Policy',
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
      );
      next();
    });

    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const token = req.headers.authorization || '';
        let currentUser = null;

        if (token) {
          try {
            currentUser = jwt.verify(token.replace('Bearer ', ''), secret);
          } catch (e) {
            throw new AuthenticationError('Invalid or expired token');
          }
        }

        return {
          user: currentUser,
          users,
          CourseEnrolled
        };
      },
      formatError: (err) => ({
        message: err.message,
        code: err.extensions.code || 'INTERNAL_SERVER_ERROR'
      })
    });

    await server.start();
    server.applyMiddleware({ app, path: '/' });

    apolloServerHandler = app;
  }

  return apolloServerHandler;
}

module.exports = async (req, res) => {
  const handler = await getApolloHandler();
  return handler(req, res);
};
