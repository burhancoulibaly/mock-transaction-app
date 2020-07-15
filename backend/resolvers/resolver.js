//graphql schema
//Query schema
//Mutation Schema
const typeDefs =`
    type Query {
        sammysHello: Response!
    }

    type Mutation {
        _empty: String
    }

    type Response {
        response_type: String!
        response: String!
    }
`;

//An object that contains mapping to get data that schema needs
const resolvers = {
    //What the query returns
    Query: {
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
};

module.exports = {
    typeDefs,
    resolvers
};