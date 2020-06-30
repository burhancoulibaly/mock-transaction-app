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
        sammysHello: String!
        login(email: String!, password: String!): LoginResponse!
    }

    type LoginResponse {
        response: String!
        accessToken: String!
        refreshToken: String!
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
            // if(!req.payload.authenticated){
            //     console.log(`${req.payload.error}, logging user in`);
            // }

            try{
                //check user credentials                
                let loginInfo = await login.getRow("email", `"${email}"`);
                
                if(loginInfo.length == 0 || compareSync(password, loginInfo[0].password.toString()) == false){
                    return {
                        response: `Invalid login information please try again`,
                        accessToken: ``,
                        refreshToken: ``
                    }
                };

                return {
                    response: `Login successful`,
                    accessToken: createAccessToken(email),
                    refreshToken: createRefreshToken(email)
                };
            }catch(err){
                console.error(err);
                throw err;
            }
        },
        sammysHello: async(_,data,{req}) => {
            console.log(req.headers);
            if(!req.payload.authenticated){
                return `Error: ${req.payload.error}`
            }

            return "Hello Muthafucka"
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