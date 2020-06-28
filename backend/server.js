const { assertWrappingType } = require('graphql');

const express = require('express'),
      app = express(),
      {ApolloServer} = require('apollo-server-express'),
      {typeDefs, resolvers} = require('./resolvers/user-resolver'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      server = require('http').createServer(app);

//integrating graphql settings
const apolloServer = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req, res }) => ({ req, res })
});
apolloServer.applyMiddleware({ app });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


server.listen(process.env.PORT || 3000);
console.log(`Server listening on port: ${process.env.PORT || 3000}`);

app.get("/", (req, res) => {

})
