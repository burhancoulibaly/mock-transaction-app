import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { TransactionInfo } from './transaction-info';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private apollo: Apollo) { }

  getTransactions(){//check error this will return if token and refresh token expire
    return this.apollo
            .watchQuery({
              query: gql(`
                {
                  getTransactions {
                    transactionId,
                    f_name,
                    l_name,
                    username,
                    amount,
                    lastFourCardNum,
                    transactionDate,
                    message,
                    is_canceled
                  }
                }
              `),
              notifyOnNetworkStatusChange: true,
              // fetchPolicy: "network-only"
            })
  }

  getUserTransactions(username){//check error this will return if token and refresh token expire
    return this.apollo
            .watchQuery({
              query: gql(`
                {
                  getUserTransactions(username: "${username}") {
                    transactionId,
                    f_name,
                    l_name,
                    username,
                    amount,
                    lastFourCardNum,
                    transactionDate,
                    message,
                    is_canceled
                  }
                }
              `),
              notifyOnNetworkStatusChange: true,
              // fetchPolicy: "network-only"
            })
  }

  submitTransaction(transaction: TransactionInfo){
    const transactionRef = gql(`
                                mutation transaction($f_name: String!, $l_name: String!, $address: String!, $addressLine2: String!, $city: String!, $state: String!, $zip: String!, $country: String!, $username: String!, $amount: Float!, $cardNum: String!, $expDate: String!, $message: String!){
                                  transaction(f_name: $f_name, l_name: $l_name, address: $address, addressLine2: $addressLine2, city: $city, state: $state, zip: $zip, country: $country, username: $username, amount: $amount, cardNum: $cardNum, expDate: $expDate, message: $message){
                                    response_type,
                                    response,
                                  }
                                }
                              `)

    return new Promise((resolve, reject) => {
            this.apollo
              .mutate({
                mutation: transactionRef,
                variables: {
                  f_name: `${transaction.billing.f_name}`,
                  l_name: `${transaction.billing.l_name}`,
                  address: `${transaction.billing.address}`,
                  addressLine2: `${transaction.billing.addressLine2}`,
                  city: `${transaction.billing.city}`,
                  state: `${transaction.billing.state}`,
                  zip: `${transaction.billing.zip}`,
                  country: `${transaction.billing.country}`,
                  username: `${transaction.username}`,
                  amount: transaction.amount,
                  cardNum: `${transaction.cardNum}`,
                  expDate: `${transaction.expDate}`,
                  message: `${transaction.message}`
                }
              })
              .subscribe(
                ({data}: any) =>  { 
                  if(data.transaction.response_type != "Success"){ 
                    return reject(data.transaction.response ? data.transaction.response : "Error cannot process your transaction at this moment");
                  }
                  
                  console.log(data);
                  resolve("Transaction completed successfully");
                  this.refetchTransactions();
                  return;
                },
                (err) => {
                  console.log(err);
                  return reject(err);
                }
              )
      })
  }

  cancelTransaction(transactionId: number){
    //checks if auithed user is same as user trying to cancel order kinda redundant, but will find a good solution
    const cancelTransactionRef = gql(`
                                      mutation cancelTransaction($transactionId: Int!){
                                        cancelTransaction(transactionId: $transactionId){
                                          response_type,
                                          response,
                                        }
                                      }
                                    `);

    return new Promise((resolve, reject) => {
            this.apollo
              .mutate({
                mutation: cancelTransactionRef,
                variables: {
                  transactionId: transactionId
                }
              })
              .subscribe(
                ({data}: any) =>  {
                  if(data.cancelTransaction.response_type != "Success"){ 
                    return reject(data.cancelTransaction.response ? data.cancelTransaction.response : "Error cannot cancel your transaction at this moment");
                  }

                  console.log(data);
                  resolve("Transaction successfully canceled");
                  this.refetchTransactions();
                  return;
                },
                (err) => {
                  console.log(err);
                  return reject(err);
                }
              )
    })
  }

  refetchTransactions(){
    //This works because it updates the cached store which triggers the valueChanges function on the get Transactions gql ref.
    this.getTransactions().refetch();
  }
}
