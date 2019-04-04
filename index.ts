require('dotenv').config();

import { ApolloServer } from 'apollo-server';
import { default as typeDefs } from './typeDefs';
import { default as resolvers } from './resolvers';

const options = { port: process.env.PORT || 4999 };

const server = new ApolloServer({
  typeDefs: typeDefs as any,
  resolvers: resolvers as any,
  context: ({ req }) => ({
    ...req
  }),
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development'
})

server.listen(options)
  .then(({ url, server }) => {
    console.log(`Server is running ⚡ on localhost:${options.port}`);
  }).catch(err => console.error('connection Error', err));