const { gql} = require('apollo-server-express'),
      { hash, genSalt, compareSync } = require('bcrypt'),
      { createAccessToken, createRefreshToken } = require('../auth'),
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
        username: String!
        accessToken: String!
    }

    type Response {
        response_type: String!
        response: String!
    }
    
    type Mutation {
        register(username: String!, f_name: String!, l_name: String!, email: String!, password: String!): LoginResponse!
        transaction(f_name: String!, l_name: String!, address: String!, addressLine2: String!, city: String!, state: String!, zip: String!, country: String!, username: String!, cardNum: String!, expDate: String!, message: String!): Response!
    }
`);

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
        transaction: async(_, { f_name, l_name, address, addressLine2, city, state, zip, country, username, cardNum, expDate, message }, {req}) => {
            let stateEntity = new Entity("state");
            let billingEntity = new Entity("billing_info");
            let paymentInfoEntity = new Entity("payment_info");
            let transactionEntity = new Entity("transactions");

            try {   
                let stateRecord = await stateEntity.getRow("state_name", `"${state}"`);
                let billingResponse = await billingEntity.insertRow([`"${f_name}"`, `"${l_name}"`, `"${address} ${addressLine2}"`, `"${stateRecord[0].state_id}"`, `"${zip}"`, `"${city}"`]);

                console.log(billingResponse);

                // have to format expiration date as date for mysql, and need a way to search for correct billing id, or have insertRow function return inserted records primary key; 
                let paymentInfoResponse = await paymentInfoEntity.insertRow([`1`, `"${cardNum}"`, `"${expDate}"`, `${billingResponse.insertId}`]);

                //will also have to find a way to retrieve payment id here, or have insertRow function return inserted records primary key.
                await transactionEntity.insertRow([`"${username}"`, `${paymentInfoResponse.insertId}`, `"${message}"`]);

                return {
                    response_type: `Success`,
                    response: `transaction successful`,
                }
                
            } catch (error) {
                console.log(error);
                
                return {
                    response_type: `${error.toString().split(":")[0].replace(" ","")}`,
                    response: `${error.toString().split(":")[1].replace(" ","")}`
                }
            }
            
        }
    }
};

module.exports = {
    typeDefs,
    resolvers
};