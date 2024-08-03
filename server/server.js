const express = require('express');
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

const app = express();

const apolloServer = new ApolloServer({ typeDefs, resolvers })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', async () => {

  await apolloServer.start()

  app.use('/graphql', expressMiddleware(apolloServer))

  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}!`);
    console.log(`GraphQL available at http://localhost:${PORT}/graphql`)
  });
});

