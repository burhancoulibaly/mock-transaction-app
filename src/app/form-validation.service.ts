import { Injectable } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  private charRegEx: RegExp = /^[A-Za-z]+$/;//validates for alphabetic characters only
  private cardNumRegEx: RegExp = /^([0-9]{4}[\s]?){3}[0-9]{4}$/;//validation for card numbers
  private dateRegEx: RegExp = /^([0-9]{2}[/]{1}){2}[0-9]{4}$/;
  private numRegEx: RegExp = /^([0-9][.]?)+[0-9]+$/;
  private zipRegEx: RegExp = /^[0-9]{5}$/;
  private ccvRegEx: RegExp = /^[0-9]{3}$/;
  private addressRegex: RegExp = /^(([\d]+[\s])?([A-z]+[\s]?)+([\d]+[/s]?)?|([A-z]+[\s]?)+([\d])+)$/;
  private emailRegex: RegExp = /^[a-zA-Z0-9_\.\-]*[@]?[a-zA-Z0-9-]*[\.]?[a-zA-Z0-9-.]*$/;
  private stringRegEx: RegExp = /^([a-zA-Z0-9]+[_\.\-]?)+$/;


  constructor() { }

  charValidation(str: string){
    return this.charRegEx.test(str);
  }

  stringValidation(str: string){
    console.log(this.stringRegEx.test(str));
    return this.stringRegEx.test(str);
  }

  cardNumValidation(str: string){
    return this.cardNumRegEx.test(str);
  }

  dateValidation(str: string){
    return this.dateRegEx.test(str);
  }

  numValidation(str: string){
    return this.numRegEx.test(str);
  }

  ccvValidation(str: string){
    return this.ccvRegEx.test(str);
  }
  
  zipValidation(str: string){
    return this.zipRegEx.test(str);
  }

  addressValidation(str: string){
    return this.addressRegex.test(str);
  }
  
  emailValidation(str: string){
    return this.emailRegex.test(str);
  }

  passwordValidation(str: string){
    if(str.length < 8){
      return false;
    }

    return true;
  }

  comparePasswords(str1: string, str2: string){
    console.log(str1, str2);
    if(str1 != str2){
      return false;
    }

    return true;
  }

  encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
}
