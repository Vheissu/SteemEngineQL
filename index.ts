require('dotenv').config();

import { ApolloServer } from 'apollo-server';

import { default as typeDefs } from './typeDefs';
import { default as resolvers } from './resolvers';
import BigInt from 'apollo-type-bigint';
import { GraphQLScalarType } from 'graphql';

const Tuple = new GraphQLScalarType({
  name: 'Tuple',
  serialize: (value) => {
      // console.log('serialize value', value);
      return value;
  },
  parseValue: (value) => {
      // console.log('parseValue value', value);
      return value;
  }
});

const options = { port: process.env.PORT || 4999 };

const server = new ApolloServer({
  typeDefs: typeDefs as any,
  resolvers: [ { BigInt: new BigInt('bigInt') }, { Tuple }, ...resolvers ] as any,
  cacheControl: {
    defaultMaxAge: 5,
  },
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