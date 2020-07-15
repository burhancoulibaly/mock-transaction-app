import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor( private authService: AuthService, private router: Router ){ };

  ngOnInit(): void {
  }

  signup(form){
    //signup function
    console.log(form);
    let firstName = form[0].value;
    let lastName = form[1].value;
    let username = form[2].value;
    let email = form[3].value;
    let password = form[4].value;//add logic to make sure passwords are the same;

    this.authService.signUp(username, firstName, lastName, email, password)
      .then((response) => {
        console.log(response);
        this.router.navigateByUrl('/home');
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

}
