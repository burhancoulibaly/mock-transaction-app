const { hash, genSalt, compareSync } = require('bcrypt'),
      { createAccessToken, createRefreshToken } = require('../auth'),
      Entity = require("../entity");

let user = new Entity("users");
let login = new Entity("login");

//graphql schema
//Query schema
//Mutation Schema
const typeDefs = `
    extend type Query {
        login(email: String!, password: String!): LoginResponse!
        userInfo(username: String!): UserInfo!
    }

    extend type Mutation {
        register(username: String!, f_name: String!, l_name: String!, email: String!, password: String!): LoginResponse!
    }

    type UserInfo {
        username: String!
        f_name: String!
        l_name: String!
        email: String!
    }

    type LoginResponse {
        response_type: String!
        response: String!
        email: String!
        username: String!
        accessToken: String!
    }
`;

//An object that contains mapping to get data that schema needs
const resolvers = {
    //What the query returns
    Query: {
        login: async(_, {email, password}, {res}) => {
            let t1ReturnVals = ["email", "token_version", "password"];
            let t2ReturnVals = ["user_name"];

            try{
                //check user credentials                
                let loginInfo = await login.getFKRightJoin(`users`, t1ReturnVals, t2ReturnVals, 'email', `"${email}"`);

                if(loginInfo.length == 0 || compareSync(password, loginInfo[0].password.toString()) == false){
                    return {
                        response_type: `Error`,
                        response: `Invalid login`,
                        email: ``,
                        username: ``,
                        accessToken: ``
                    }
                };

                res.cookie('jid', createRefreshToken(loginInfo[0].email.toString(), loginInfo[0].user_name.toString(), loginInfo[0].token_version.toString()), {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days 24hours 60minutes 60secs 1000ms
                    httpOnly: true,
                    secure: true
                    
                });

                return {
                    response_type: `Success`,
                    response: `Login successful`,
                    email: `${loginInfo[0].email.toString()}`,
                    username: `${loginInfo[0].user_name.toString()}`,
                    accessToken: createAccessToken(loginInfo[0].email.toString(), loginInfo[0].user_name.toString(), loginInfo[0].token_version.toString())
                };
            }catch(err){
                return {
                    response_type: err.toString().split(":")[0].replace(" ",""),
                    response: err.toString().split(":")[1].replace(" ",""),
                    email: ``,
                    username: ``,
                    accessToken: ``
                }
            }
        },
        userInfo: async(_, {username}, {req}) => {
            if(!req.payload.authenticated){
                req.payload.error = req.payload.error.toString().split(":");
                 
                throw new Error(req.payload.error);
            }

            let users = new Entity('users');

            try {
                let userInfo = await users.getRow("user_name", `"${username}"`);

                return{
                    username: userInfo[0].user_name.toString(),
                    f_name: userInfo[0].f_name.toString(),
                    l_name: userInfo[0].l_name.toString(),
                    email: userInfo[0].email.toString()
                }
            } catch (error) {
                throw error;
            }
        }
    },
    //For when mutations(changes) are made to the database
    Mutation: {
        register: async(_, { username, f_name, l_name, email, password }, {res}) => {
            try{
                const saltRounds = 12;
                const salt = await genSalt(saltRounds);
                const hashedPassword = await hash(password,salt);
                const tokenVersion = 0;

                await login.insertRow([`"${email}"`, `"${hashedPassword}"`, `"${tokenVersion}"`]);
                await user.insertRow([`"${username}"`, `"${f_name}"`, `"${l_name}"`, `"${email}"`]);

                res.cookie('jid', createRefreshToken(email, username, tokenVersion), {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days 24hours 60minutes 60secs 1000ms
                    httpOnly: true,
                    secure: true
                    
                });

                return {
                    response_type: `Success`,
                    response: `Login successful`,
                    email: `${email}`,
                    username: `${username}`,
                    accessToken: createAccessToken(email, username, tokenVersion)
                };

            }catch(err){
                return {
                    response_type: err.toString().split(":")[0].replace(" ",""),
                    response: err.toString().split(":")[1].replace(" ",""),
                    email: ``,
                    username: ``,
                    accessToken: ``
                }
            }
        },
    }
};

module.exports = {
    typeDefs,
    resolvers
};