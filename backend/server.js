const express = require('express'),
      app = express(),
      {ApolloServer} = require('apollo-server-express'),
      {resolvers: mainResolver, typeDefs: mainTypeDefs} = require('./resolvers/resolver'),
      {resolvers: userResolver, typeDefs: userTypeDefs} = require('./resolvers/user-resolver'),
      {resolvers: transactionResolver, typeDefs: transactionTypeDefs} = require('./resolvers/transactions-resolver'),
      {authenticateUser, revokeTokens, refreshToken} = require('./auth'),
      {merge} = require('lodash'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      server = require('http').createServer(app),
      cookieParser = require("cookie-parser");

let whitelist = ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:3000/graphql' ];
let corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
}

//integrating graphql settings
const apolloServer = new ApolloServer({
    typeDefs: [mainTypeDefs, userTypeDefs, transactionTypeDefs], 
    resolvers: merge(mainResolver, userResolver, transactionResolver),
    context: ({ req, res }) => ({ req, res })
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(authenticateUser);

apolloServer.applyMiddleware({ 
    app,
    cors: false
});

server.listen(process.env.PORT || 3000);
console.log(`Server listening on port: ${process.env.PORT || 3000}`);

app.post('/revokeTokens', async(req, res) => {
    if(!req.body.email){
        res.status(400).send("No email sent in request");
        return;
    }
    
    try {
        let response = await revokeTokens(req.body.email);
        res.status(200).send(response);
        return;
    } catch (error) {
        res.status(400).send(error);
        return;
    }
})

app.get('/refreshToken', async(req, res) => {
    try {
        let response = await refreshToken(req.cookies.jid, res);

        res.status(200).send(response);
        return;

    } catch (error) {
        res.status(400).send(error);
        return;
    }
})

app.get('/deleteRefreshToken', async(req, res) => {
    try {
        res.clearCookie('jid');
        res.status(200).send({ok: true})
        return;
    } catch (error) {
        res.status(400).send({ok: false, error: error});
        return;
    }
})