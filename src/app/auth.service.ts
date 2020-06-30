import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';
import { CookieService } from 'ngx-cookie-service';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: String;
  private cookieValue: String;

  constructor(private apollo: Apollo, private cookieService: CookieService, private http: HttpClient) {}

  async login(){
    return new Promise((resolve, reject) => {
            this.apollo
              .query({
                query: gql(`
                  {
                    login(email: "menz.couli@gmail.com", password: "worldwidmenz"){
                      response,
                      accessToken,
                      refreshToken
                    }
                  }
                `)
              })
              .subscribe(
                ({data}: any) =>  { 
                  this.token = data.login.accessToken; 
                  this.setCookie(data.login.refreshToken);
                  resolve("Login Successfull");
                },
                (err) => reject(err)
              )
    })
  }

  setCookie(refreshToken){
    this.cookieService.set("refresh_token", refreshToken);
    this.cookieValue = this.cookieService.get("refresh_token");
  }

  async refreshAccessToken(){
    return new Promise((resolve,reject) => {
      const body = { refresh_token: this.cookieValue }

      this.http.post<any>(`http://localhost:3000/refresh_token`, body)
        .subscribe(
          (data) => {
            this.token = data.accessToken;
            resolve("access token refreshed");
          },
          (err) => {
            reject(err);
          }
        )
    })
  }

  getToken(){
    return this.token;
  }

  test(){
    return this.apollo
            .watchQuery({
              query: gql(`
                {
                  sammysHello
                }
              `)
            });
  }
  
}
