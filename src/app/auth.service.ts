import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus: any;
  public authChange: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo, private http: HttpClient) {}

  login(email: String, password: String){
    return new Promise((resolve, reject) => {
            //email: "menz.couli@gmail.com", password: "worldwidmenz"
            this.apollo
              .query({
                query: gql(`
                  {
                    login(email: "${email}", password: "${password}"){
                      response_type,
                      response,
                      email,
                      accessToken
                    }
                  }
                `),
                fetchPolicy: "network-only"
              })
              .subscribe(
                ({data}: any) =>  { 
                  if(data.login.response_type == "Error"){
                    if(data.login.response == "Invalid login"){
                      return reject("Invalid username or password");
                    }
                    
                    return reject("Unable to log you in at this moment");
                  }

                  this.authStatus = { isLoggedIn: true, email: data.login.email, token: data.login.accessToken };
                  this.authChanged(); 
                  return resolve("Login Successfull");
                },
                (err) => {
                  return reject(err);
                }
              )
    })
  }

  authChanged(){
    this.authChange.next(this.authStatus ? this.authStatus.isLoggedIn : false);
  }

  signUp(username: String, f_name: String, l_name: String, email: String, password: String){
    return new Promise((resolve, reject) => {
            this.apollo
              .mutate({
                mutation: gql(`
                  {
                    register(username: ${username}, f_name: ${f_name}, l_name: ${l_name}, email: ${email}, password: ${password})
                  }
                `)
              })
              .subscribe(
                ({data}: any) =>  { 
                  return resolve(data);
                },
                (err) => {
                  return reject(err);
                }
              )
      })
  }

  logOut(){
    return new Promise(async (resolve, reject) => {
      try {
        this.authStatus = null;
        // console.log(this.authStatus.token);
        this.deleteRefreshToken();
        this.authChanged();
        await this.apollo.getClient().clearStore();//If queries are cached I have to know when a token is expired to refresh it and when refresh token expires.
      } catch (error) {
        return error;
      }
      
      return  resolve("successfully logged out");
    })
  }

  getAuthStatus(){
    return this.authStatus;
  }

  refreshToken(){
    return new Promise((resolve, reject) => {
      this.http.get<any>(`http://localhost:3000/refreshToken`)
        .subscribe(
          (data) => {
            console.log(data);
            this.authStatus = { isLoggedIn: true, email: data.email, token: data.accessToken };
            this.authChanged();
            return resolve("Token successfully refreshed");
          },
          (err) => {
            return reject(err);
          }
        )
    })
  }

  deleteRefreshToken(){
    return new Promise((resolve, reject) => {
      this.http.get<any>(`http://localhost:3000/deleteRefreshToken`)
        .subscribe(
          (data) => {
            console.log(data);
            return resolve("refreshToken cleared");
          },
          (err) => {
            return reject(err);
          }
        )
    })
  }

  test(){//check error this will return if token and refresh token expire
    return new Promise((resolve,reject) => {
            this.apollo
              .query({
                query: gql(`
                  {
                    sammysHello{
                      response_type,
                      response
                    }
                  }
                `),
                fetchPolicy: "network-only"
              })
              .subscribe(
                ({data}: any) =>  { 
                  if(data.sammysHello.response_type == "JsonWebTokenError" || data.sammysHello.response_type == "TokenExpiredError"){
                    return resolve("Unable to authenticate user, try logging in");
                  }
                  return resolve(data);
                },
                (err) => {
                  return reject(err);
                }
              )
    })
  }
  
}
