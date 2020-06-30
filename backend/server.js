const express = require('express'),
      app = express(),
      {ApolloServer} = require('apollo-server-express'),
      {typeDefs, resolvers} = require('./resolvers/user-resolver'),
      {authenticateUser, createAccessToken} = require('./auth'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      server = require('http').createServer(app),
      cookieParser = require("cookie-parser"),
      { verify } = require('jsonwebtoken'),
      Entity = require("./entity");

let users = new Entity("users");
// console.log(users)

//integrating graphql settings
const apolloServer = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req, res }) => ({ req, res })
});

app.use(cors());
app.use(authenticateUser);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

apolloServer.applyMiddleware({ app });

server.listen(process.env.PORT || 3000);
console.log(`Server listening on port: ${process.env.PORT || 3000}`);

app.get("/", (req, res) => {});

app.post("/refresh_token", async (req, res) => {
    const token = req.body.refresh_token;

    if(!token){
        return res.send({ok: false, accessToken: ``});
    }

    let payload = null;

    try{
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    }catch(err){
        console.log(err);
        return res.send({ ok: false, accessToken: ``});
    }

    console.log(users);
    //Since token is valid a new accessToken is returned;
    const user = await users.getRow("email", `"${payload.email}"`);

    if(!user){
        return res.send({ ok: false, accessToken: ``});
    }

    return res.send({
        ok: true,
        accessToken: createAccessToken(user[0].email)
    });
});
