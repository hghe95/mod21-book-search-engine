const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { authMiddleware } = require(`./utils/auth`);
// imported apollo server
const { ApolloServer } = require(`apollo-server-express`);
// imported resolvers and typedefs
const { resolvers, typeDefs } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

const StartApolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  context: authMiddleware
});

StartApolloServer.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, `../client/build/index.html`));
});

//app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Please use GraphQL at http://localhost:${PORT}${StartApolloServer.graphqlPath}`);
  });
});
