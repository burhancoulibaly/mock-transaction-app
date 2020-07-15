import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor( private authService: AuthService, private router: Router ){};

  ngOnInit(): void {
  }

  login(form){
    let email = form[0].value;
    let password = form[1].value;

    this.authService.login(email, password)
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
