import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { TransactionInfo } from './transaction-info';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private apollo: Apollo) { }

  submitTransaction(transaction: TransactionInfo){
    const transactionRef = gql(`
                                mutation transaction($f_name: String!, $l_name: String!, $address: String!, $addressLine2: String!, $city: String!, $state: String!, $zip: String!, $country: String!, $username: String!, $cardNum: String!, $expDate: String!, $message: String!){
                                  transaction(f_name: $f_name, l_name: $l_name, address: $address, addressLine2: $addressLine2, city: $city, state: $state, zip: $zip, country: $country, username: $username, cardNum: $cardNum, expDate: $expDate, message: $message){
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
                  cardNum: `${transaction.cardNum}`,
                  expDate: `${transaction.expDate}`,
                  message: `${transaction.message}`
                }
              })
              .subscribe(
                ({data}: any) =>  { 
                  if(data.transaction.response_type == "Error"){ 
                    return reject(data.transaction.response ? data.transaction.response : "No access token returned");
                  }
                  
                  console.log(data);
                  return resolve("Transaction completed successfully");
                },
                (err) => {
                  console.log(err);
                  return reject(err);
                }
              )
      })
  }


}
