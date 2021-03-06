const Entity = require("../entity");

//graphql schema
//Query schema
//Mutation Schema
const typeDefs = `
    extend type Query {
        getTransactions: [TransactionInfo!]
        getUserTransactions(username: String!): [TransactionInfo!]
    }
    extend type Mutation {
        transaction(f_name: String!, l_name: String!, address: String!, addressLine2: String!, city: String!, state: String!, zip: String!, country: String!, username: String!, amount: Float!, cardNum: String!, expDate: String!, message: String!): Response!
        cancelTransaction(transactionId: Int!): Response!
    }

    type TransactionInfo {
        transactionId: Int!
        f_name: String!
        l_name: String!
        username: String!
        amount: Float!
        lastFourCardNum: String!
        transactionDate: String!
        message: String!
        is_canceled: String!
    }
`;

//An object that contains mapping to get data that schema needs
const resolvers = {
    //What the query returns
    Query: {
        getTransactions: async(_, data, {res}) => {
            let billingInfoEntity = new Entity("billing_info");
            let paymentInfoEntity = new Entity("payment_info");
            let transactionEntity = new Entity("transactions");

            //Find better way to make this call maybe using joins (would need a triple join) or something else
            try {
                let allBillingInfo = await billingInfoEntity.getAll();
                let allPaymentInfo = await paymentInfoEntity.getAll();
                let allTransactions = await transactionEntity.getAll("is_canceled", false);
                let transactions = [];

                

                for(let i = 0; i < allTransactions.length; i++){
                    let cardNum = allPaymentInfo[i].card_num.toString().replace(/[ \x00-\x1F\x7F-\x9F]/g,"");
                    let lastFourCardNum = cardNum.slice(cardNum.length-4, cardNum.length);

                    transactions.push({
                        transactionId: allTransactions[i].transaction_id,
                        f_name: allBillingInfo[i].f_name.toString(),
                        l_name: allBillingInfo[i].l_name.toString(),
                        username: allTransactions[i].user_name.toString(),
                        amount: allTransactions[i].amount,
                        lastFourCardNum: lastFourCardNum,
                        transactionDate: allTransactions[i].transaction_date.toString(),
                        message: allTransactions[i].message.toString(),
                        is_canceled: allTransactions[i].is_canceled.toString(),
                    });
                }

                return transactions;
            } catch (error) {
                throw error;
            }
        },
        getUserTransactions: async(_, {username}, {res}) => {
            let billingInfoEntity = new Entity("billing_info");
            let paymentInfoEntity = new Entity("payment_info");
            let transactionEntity = new Entity("transactions");

            //Find better way to make this call maybe using joins (would need a triple join) or something else
            try {
                let allBillingInfo = await billingInfoEntity.getAll();
                let allPaymentInfo = await paymentInfoEntity.getAll();
                let allTransactions = await transactionEntity.getAll("user_name", `"${username}"`);
                let transactions = [];

                

                for(let i = 0; i < allTransactions.length; i++){
                    let cardNum = allPaymentInfo[i].card_num.toString().replace(/[ \x00-\x1F\x7F-\x9F]/g,"");
                    let lastFourCardNum = cardNum.slice(cardNum.length-4, cardNum.length);

                    transactions.push({
                        transactionId: allTransactions[i].transaction_id,
                        f_name: allBillingInfo[i].f_name.toString(),
                        l_name: allBillingInfo[i].l_name.toString(),
                        username: allTransactions[i].user_name.toString(),
                        amount: allTransactions[i].amount,
                        lastFourCardNum: lastFourCardNum,
                        transactionDate: allTransactions[i].transaction_date.toString(),
                        message: allTransactions[i].message.toString(),
                        is_canceled: allTransactions[i].is_canceled.toString(),
                    });
                }

                return transactions;
            } catch (error) {
                throw error;
            }
        }
    },
    //For when mutations(changes) are made to the database
    Mutation: {
        transaction: async(_, { f_name, l_name, address, addressLine2, city, state, zip, country, username, amount, cardNum, expDate, message }, {req}) => {
            if(!req.payload.authenticated){
                req.payload.error = req.payload.error.toString().split(":");
                return {
                    response_type: `${req.payload.error[0].replace(" ","")}`,
                    response: `${req.payload.error[1].replace(" ","")}`
                }
            }

            let stateEntity = new Entity("state");
            let billingEntity = new Entity("billing_info");
            let paymentInfoEntity = new Entity("payment_info");
            let transactionEntity = new Entity("transactions");

            expDate = `${expDate.split("/")[2]}-${expDate.split("/")[0]}-${expDate.split("/")[1]}`;

            let today = new Date(); 
            let fullDate = formatDateTime(today);

            try {   
                let stateRecord = await stateEntity.getRow("state_name", `"${state}"`);
                let billingResponse = await billingEntity.insertRow([`"${f_name}"`, `"${l_name}"`, `"${address} ${addressLine2}"`, `"${stateRecord[0].state_id}"`, `"${zip}"`, `"${city}"`]);

                console.log(billingResponse);

                // have to format expiration date as date for mysql, and need a way to search for correct billing id, or have insertRow function return inserted records primary key; 
                let paymentInfoResponse = await paymentInfoEntity.insertRow([`1`, `"${cardNum}"`, `"${expDate}"`, `${billingResponse.insertId}`]);

                //will also have to find a way to retrieve payment id here, or have insertRow function return inserted records primary key.
                await transactionEntity.insertRow([`"${username}"`, `${paymentInfoResponse.insertId}`, `"${message}"`, `"${fullDate}"`, amount, false]);

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
            
        },
        cancelTransaction: async(_, { transactionId }, {req}) => {
            if(!req.payload.authenticated){
                req.payload.error = req.payload.error.toString().split(":");
                return {
                    response_type: `${req.payload.error[0].replace(" ","")}`,
                    response: `${req.payload.error[1].replace(" ","")}`
                }
            }

            let transactionEntity = new Entity("transactions");

            try {
                await transactionEntity.editRow("transaction_id", transactionId, "is_canceled", true);

                return {
                    response_type: `Success`,
                    response: `transaction successfully canceled`,
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

formatDateTime = function(date){
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd} 00:00:00`;
}

module.exports = {
    typeDefs,
    resolvers
};