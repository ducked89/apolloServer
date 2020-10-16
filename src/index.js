require('dotenv/config');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server');

// Local modules
const { connectDb } = require('./config/database');
const models = require('./models');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/schema');

const app = express();
const PORT = process.env.PORT || process.env.APP_PORT;
// Middleware
app.use(cors());
app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    // if (connection) {
    //   return {
    //     models,
    //     loaders: {
    //       user: new DataLoader(keys =>
    //         loaders.user.batchUsers(keys, models),
    //       ),
    //     },
    //   };
    // }

    if (req) {
      const me = await getMe(req);
      return {
        req,
        models,
        me,
        secret: process.env.JWT_SECRET,
        exp_secret: process.env.JWT_EXPIRATION,
        // loaders: {
        //   user: new DataLoader(keys =>
        //     loaders.user.batchUsers(keys, models),
        //   ),
        // },
      };
    }
  },
});

connectDb().then(async () => {
  console.log("Mongodb running up!");
  server.listen({port:PORT}).then(({ url }) => {
    console.log(`🚀  Apollo Server on http://localhost:${PORT}/`);
  });
});