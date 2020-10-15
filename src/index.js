require('dotenv/config');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const express = require('express');
const { ApolloServer, AuthenticationError, gql} = require('apollo-server');

// Local modules
const { connectDb } = require('./config/database');


const app = express();
const PORT = process.env.PORT || process.env.APP_PORT;
// Middleware
app.use(cors());
app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};


const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;

const resolvers = {
    Query: {
      books: () => books,
    },
};

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

connectDb().then(async () => {
  console.log("Mongodb running up!")
  server.listen({port:PORT}).then(({ url }) => {
    console.log(`🚀  Apollo Server on http://localhost:${PORT}/`);
  });

});
