const { gql} = require('apollo-server-express'),
      { hash, genSalt, compareSync } = require('bcrypt'),
      { createAccessToken, createRefreshToken } = require('../auth');
      Entity = require("../entity");

let user = new Entity("users");
let login = new Entity("login");

//graphql schema
//Query schema
//Mutation Schema
const typeDefs = gql(`
    type Query {
        sammysHello: Response!
        login(email: String!, password: String!): LoginResponse!
    }

    type LoginResponse {
        response_type: String!
        response: String!
        email: String!
        accessToken: String!
    }

    type Response {
        response_type: String!
        response: String!
    }
    
    type Mutation {
        register(username: String!, f_name: String!, l_name: String!, email: String!, password: String!): String!
    }
`);

//An object that contains mapping to get data that schema needs
const resolvers = {
    //What the query returns
    Query: {
        login: async(_, {email, password}, {req, res}) => {
            try{
                //check user credentials                
                let loginInfo = await login.getRow("email", `"${email}"`);
                
                if(loginInfo.length == 0 || compareSync(password, loginInfo[0].password.toString()) == false){
                    return {
                        response_type: `Error`,
                        response: `Invalid login`,
                        email: ``,
                        accessToken: ``
                    }
                };

                res.cookie('jid', createRefreshToken(loginInfo[0].email.toString(), loginInfo[0].token_version.toString()), {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days 24hours 60minutes 60secs 1000ms
                    httpOnly: true,
                    secure: true
                    
                });

                return {
                    response_type: `Success`,
                    response: `Login successful`,
                    email: `${loginInfo[0].email.toString()}`,
                    accessToken: createAccessToken(loginInfo[0].email.toString(), loginInfo[0].token_version.toString())
                };
            }catch(err){
                return {
                    response_type: err.toString().split(":")[0].replace(" ",""),
                    response: err.toString().split(":")[1].replace(" ",""),
                    email: ``,
                    accessToken: ``
                }
            }
        },
        sammysHello: async(_,data,{req}) => {
            console.log(req.headers);
            if(!req.payload.authenticated){
                req.payload.error = req.payload.error.toString().split(":");
                return {
                    response_type: `${req.payload.error[0].replace(" ","")}`,
                    response: `${req.payload.error[1].replace(" ","")}`
                }
            }

            return {
                response_type: "Success",
                response: "Hello There"
            }
        }
    },
    //For when mutations(changes) are made to the database
    Mutation: {
        register: async(_, {username, f_name, l_name, email, password}) => {
            try{
                const saltRounds = 12;
                const salt = await genSalt(saltRounds);
                const hashedPassword = await hash(password,salt);

                let result = [];

                result.push((await login.insertRow([`"${email}"`, `"${hashedPassword}"`])).toString());
                result.push((await user.insertRow([`"${username}"`, `"${f_name}"`, `"${l_name}"`, `"${email}"`])).toString());

                console.log(result);

                return `User registration successful`;

            }catch(err){
                console.error(err);
                throw err;
            }
        },
    }
};

module.exports = {
    typeDefs,
    resolvers
};