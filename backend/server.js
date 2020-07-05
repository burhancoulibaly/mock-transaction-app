const express = require('express'),
      app = express(),
      {ApolloServer} = require('apollo-server-express'),
      {typeDefs, resolvers} = require('./resolvers/user-resolver'),
      {authenticateUser, revokeTokens, refreshToken, createRefreshToken} = require('./auth'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      server = require('http').createServer(app),
      { verify } = require('jsonwebtoken');
      cookieParser = require("cookie-parser");


let whitelist = ['http://localhost:4200', 'http://localhost:3000'];
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
    typeDefs, 
    resolvers,
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
        let response = await refreshToken(req.cookies.jid);
        const payload = verify(response.accessToken, process.env.ACCESS_TOKEN_SECRET);

        res.cookie('jid', createRefreshToken(payload.email, payload.tokenVersion), {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7days 24hours 60minutes 60secs 1000ms
            httpOnly: true,
            secure: true
            
        });

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